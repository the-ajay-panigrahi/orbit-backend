const ConnectionRequest = require("../models/connection");
const {
  validateConnectionSendRequest,
  validateConnectionReviewRequest,
} = require("../utils/validation");

// Send Connection Request Controller (interested / ignored)
const sendConnectionRequest = async (req, res) => {
  try {
    const toUser = await validateConnectionSendRequest(req);

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if (fromUserId.equals(toUserId)) {
      throw new Error("Cannot send connection request to yourself!");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message:
        status === "interested"
          ? `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} ignored ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Failed to send request" });
  }
};

// Review Connection Request Controller (accepted / rejected)
const reviewConnectionRequest = async (req, res) => {
  try {
    validateConnectionReviewRequest(req);

    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new Error("Connection request doesnot exist!!");
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    res.status(200).json({ message: "Connection request " + status });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
};
