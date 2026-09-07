const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getReceivedRequests,
  getConnections,
  getFeed,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, getReceivedRequests);
userRouter.get("/user/connections", userAuth, getConnections);
userRouter.get("/user/feed", userAuth, getFeed);

module.exports = userRouter;
