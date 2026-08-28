require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());

// Signup 
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to create user",
    });
  }
});

// Get single user
app.get("/user", async (req, res) => {
  try {
    const { email, userId } = req.query;
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      return res
        .status(400)
        .json({ error: "Please provide an email or userId query parameter" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message || "Something went wrong" });
  }
});

// Feed API - Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
});

// Delete user by ID
app.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User successfully deleted!", data: deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to delete user" });
  }
});

// Update user profile by ID
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "profilePictureUrl",
    "about",
    "lookingFor",
    "gender",
    "age",
    "skills",
    "password",
  ];

  const isUpdateAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key),
  );

  if (!isUpdateAllowed) {
    return res
      .status(400)
      .json({ error: "Update not allowed for one or more fields!" });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({
      message: "User successfully updated",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update user" });
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
