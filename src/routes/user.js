const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allRecievedConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age skills about profilePictureUrl lookingFor gender",
    );

    res.status(200).json({
      message: "Fetched connection requests successfully",
      data: allRecievedConnectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName age skills about profilePictureUrl lookingFor gender",
      )
      .populate(
        "toUserId",
        "firstName lastName age skills about profilePictureUrl lookingFor gender",
      );

    const data = allConnections.map((user) => {
      if (user.fromUserId.equals(loggedInUser._id)) {
        return user.toUserId;
      }
      return user.fromUserId;
    });

    res.status(200).json({
      message: "Fetched all connections successfully!!",
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
