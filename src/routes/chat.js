const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { getChatMessages } = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, getChatMessages);

module.exports = chatRouter;
