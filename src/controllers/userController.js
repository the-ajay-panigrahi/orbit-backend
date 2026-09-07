const mongoose = require("mongoose");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");

const getReceivedRequests = async (req, res) => {
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
};

const getConnections = async (req, res) => {
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
};

const getFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    page = page < 1 ? 1 : page;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const myConnectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Exclude self and any user with an existing connection (any status)
    const hideUsersFromFeed = new Set();
    myConnectionRequests.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // Also exclude any IDs currently loaded in the client's active deck to prevent duplicate or skipped items
    if (req.query.exclude) {
      const excludeList = req.query.exclude.split(",");
      excludeList.forEach((id) => {
        const trimmed = id.trim();
        if (mongoose.Types.ObjectId.isValid(trimmed)) {
          hideUsersFromFeed.add(trimmed);
        }
      });
    }

    // When exclude is provided, dynamic set exclusion already offsets pagination; otherwise fallback to skip
    const effectiveSkip = req.query.exclude ? 0 : skip;

    const userFeed = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(
        "_id firstName lastName about profilePictureUrl skills lookingFor age gender",
      )
      .skip(effectiveSkip)
      .limit(limit);

    res.status(200).json({
      message: "User feed fetched successfully!",
      data: userFeed,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getReceivedRequests,
  getConnections,
  getFeed,
};
