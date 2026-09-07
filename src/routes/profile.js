const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  viewProfile,
  editProfile,
  updatePassword,
} = require("../controllers/profileController");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, viewProfile);
profileRouter.patch("/profile/edit", userAuth, editProfile);
profileRouter.patch("/profile/password", userAuth, updatePassword);

module.exports = profileRouter;
