const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connection");

const getChatMessages = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: currentUserId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({ error: "You can only chat with accepted connections." });
    }

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName profilePictureUrl",
    });

    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch chat messages" });
  }
};

module.exports = {
  getChatMessages,
};
