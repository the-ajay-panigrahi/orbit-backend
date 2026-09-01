const validator = require("validator");
const { findById } = require("../models/user");
const User = require("../models/user");
const ConnectionRequest = require("../models/connection");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Either first or lastname should exist!");
  } else if (!email) {
    throw new Error("Email should exist!");
  } else if (!password) {
    throw new Error("Password should exist!");
  }
};

const validateLogIn = (req) => {
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Email should exist!");
  } else if (!password) {
    throw new Error("Password should exist!");
  }
};

const validateProfileEditData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "age",
    "about",
    "lookingFor",
    "gender",
    "profilePictureUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEdits.includes(field);
  });

  return isEditAllowed;
};

const validateProfilePasswordData = (req) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error("No old and new password exists");
  } else if (oldPassword === newPassword) {
    throw new Error("New password cannot be same as old password!");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Password is not strong");
  }
};

const validateConnectionSendRequest = async (req) => {
  const allowedStatus = ["ignored", "interested"];
  const isAllowed = allowedStatus.includes(req.params.status);

  if (!isAllowed) {
    throw new Error("Invalid status!");
    throw new Error("Invalid status: " + req.params.status);
  }
  const toUserId = await User.findById(req.params.toUserId);

  if (!toUserId) {
    throw new Error(
      "The person to whom the connection request is send...he doesnot exist!",
    );
  const toUser = await User.findById(req.params.toUserId);

  if (!toUser) {
    throw new Error("User does not exist!");
  }

  const loggedInUser = req.user;

  const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: loggedInUser._id, toUserId: toUserId._id },
      { fromUserId: toUserId._id, toUserId: loggedInUser._id },
      { fromUserId: loggedInUser._id, toUserId: toUser._id },
      { fromUserId: toUser._id, toUserId: loggedInUser._id },
    ],
  });

  if (existingConnectionRequest) {
    throw new Error("Connection Request already exists!!");
  }

  return toUser;
};

module.exports = {
  validateSignUp,
  validateLogIn,
  validateProfileEditData,
  validateProfilePasswordData,
  validateConnectionSendRequest,
};
