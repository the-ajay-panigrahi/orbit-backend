const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    page = page < 1 ? 1 : page;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const myConnectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    myConnectionRequests.forEach((individualConnection) => {
      hideUsersFromFeed.add(individualConnection.fromUserId.toString());
      hideUsersFromFeed.add(individualConnection.toUserId.toString());
    });

    hideUsersFromFeed.add(loggedInUser._id.toString());

    const userFeed = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(
        "_id firstName lastName about profilePictureUrl skills lookingFor age gender",
      )
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "User feed fetched successfully!", data: userFeed });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
