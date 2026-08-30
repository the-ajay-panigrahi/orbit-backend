require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUp, validateLogIn } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { auth } = require("./middlewares/auth");


const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(cookieParser());

// Signup
app.post("/signup", async (req, res) => {
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
});

// Login
app.post("/login", async (req, res) => {
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

    res.cookie("token", jsonWebToken, {
      expires: new Date(Date.now() + 24 * 3600000),
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged in successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to login user",
    });
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile fetched successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to get profile",
    });
  }
});


// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

ConnectDB()
  .then(() => {
    console.log("DB connection established successfully!");
    app.listen(PORT, () => {
      console.log(`Server is successfully running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed!!", error);
  });
