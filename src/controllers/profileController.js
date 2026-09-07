const {
  validateProfileEditData,
  validateProfilePasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const viewProfile = async (req, res) => {
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
};

const editProfile = async (req, res) => {
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
};

const updatePassword = async (req, res) => {
  try {
    validateProfilePasswordData(req);

    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordCorrect = await user.checkPassword(oldPassword);

    if (!isOldPasswordCorrect) {
      throw new Error("Old password is Incorrect!");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully!",
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Failed to update password" });
  }
};

module.exports = {
  viewProfile,
  editProfile,
  updatePassword,
};
