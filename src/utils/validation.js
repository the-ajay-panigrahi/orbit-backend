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

module.exports = {
  validateSignUp,
  validateLogIn,
};
