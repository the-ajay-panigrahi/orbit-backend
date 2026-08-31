const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid profile edit fields!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    const userResponse = loggedInUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "User profile updated successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to update profile",
    });
  }
});

module.exports = profileRouter;
