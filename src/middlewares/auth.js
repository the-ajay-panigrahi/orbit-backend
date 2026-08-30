const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies || {};

    if (!token) {
      return res
        .status(401)
        .json({ error: "Please authenticate! No token found." });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decodedData._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found!" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      error: error.message || "Invalid or expired token!",
    });
  }
};

module.exports = {
  userAuth,
};
