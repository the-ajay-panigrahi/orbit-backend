require("dotenv").config();
const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());

// Signup Route
app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    const userObject = req.body;

    const user = new User(userObject);

    const user = new User(req.body);
    await user.save();
    res.status(200).send("User data saved successfully!!");
    res.status(201).json({
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    console.error(
      "Error occured while creating a user(doing signup) - ",
      error.message,
    );
    res.status(400).send("Signup failed!!");
    res.status(400).json({
      error: error.message || "Failed to create user",
    });
  }
});

// get one user from the db
// Get single user by query (e.g., /user?email=... or /user?userId=...)
app.get("/user", async (req, res) => {
  console.log(req.body.lastName);
  try {
    const { email, userId } = req.query;
    let user;

  // const user = await User.findById(req.body.myId);
  const user = await User.findOne({ lastName: req.body.lastName });
  console.log(user);
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      return res.status(400).json({ error: "Please provide an email or userId query parameter" });
    }

  res.send(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message || "Something went wrong" });
  }
});

// Feed-api, get all users from the db
// Feed API - Get all users
app.get("/feed", async (req, res) => {
  const users = await User.find({});
  console.log(users);

  res.send(users);
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
});

app.delete("/user", async (req, res) => {
// Delete user by ID (supports /user/:userId or body userId)
app.delete("/user/:userId?", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.myId);
    res.send("user successfully deleted!");
    const userId = req.params.userId || req.body?.userId || req.body?.myId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required for deletion" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User successfully deleted!", data: deletedUser });
  } catch (error) {
    res.status(400).send("Something went wrong!");
    res.status(400).json({ error: error.message || "Failed to delete user" });
  }
});

// Update user profile by ID
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  const userId = req.params.userId;

  const ALLOWED_UPDATES = [
    "photoUrl",
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
    ALLOWED_UPDATES.includes(key)
  );

  if (!isUpdateAllowed) {
    return res
      .status(400)
      .send({ error: "Update not allowed for these fields!" });
    return res.status(400).json({ error: "Update not allowed for one or more fields!" });
  }

  try {
    const user = await User.findByIdAndUpdate({ userId }, req.body, {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);

    if (!user) {
      res.status(400).send("No user found!");
    } else {
      res.send("user successfully updated");
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({
      message: "User successfully updated",
      data: user,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send("Something went wrong!");
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
