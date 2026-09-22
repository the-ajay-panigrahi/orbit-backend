const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUp, validateLogIn } = require("../utils/validation");

const getCookieOptions = (req) => {
  const isSecure =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    req.secure ||
    req.headers["x-forwarded-proto"] === "https";

  return {
    expires: new Date(Date.now() + 24 * 3600000),
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
  };
};

const signup = async (req, res) => {
  try {
    validateSignUp(req);

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();

    const jsonWebToken = user.generateJsonWebToken();
    res.cookie("token", jsonWebToken, getCookieOptions(req));

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to create user",
    });
  }
};

const login = async (req, res) => {
  try {
    validateLogIn(req);

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials!");
    }

    const jsonWebToken = user.generateJsonWebToken();
    const userResponse = user.toObject();
    delete userResponse.password;

    res.cookie("token", jsonWebToken, getCookieOptions(req));

    res.status(200).json({
      message: "User logged in successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to login user",
    });
  }
};

const logout = (req, res) => {
  const options = getCookieOptions(req);
  options.expires = new Date(Date.now());

  res
    .cookie("token", null, options)
    .status(200)
    .json({
      message: "User successfully logged out",
    });
};

module.exports = {
  signup,
  login,
  logout,
};
