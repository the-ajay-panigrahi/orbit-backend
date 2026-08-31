const validator = require("validator");

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

module.exports = {
  validateSignUp,
  validateLogIn,
  validateProfileEditData,
  validateProfilePasswordData,
};
