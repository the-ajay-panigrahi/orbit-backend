const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connection");

const getChatMessages = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = parseInt(req.query.skip, 10) || 0;

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
      return res.status(200).json({
        _id: chat._id,
        participants: chat.participants,
        messages: [],
        totalMessages: 0,
        hasMore: false,
      });
    }

    const allMessages = chat.messages || [];
    const totalMessages = allMessages.length;

    // Slicing from end: skip=0, limit=25 returns newest 25
    const endIndex = Math.max(0, totalMessages - skip);
    const startIndex = Math.max(0, endIndex - limit);
    const paginatedMessages = allMessages.slice(startIndex, endIndex);
    const hasMore = startIndex > 0;

    res.status(200).json({
      _id: chat._id,
      participants: chat.participants,
      messages: paginatedMessages,
      totalMessages,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch chat messages" });
  }
};

module.exports = {
  getChatMessages,
};
