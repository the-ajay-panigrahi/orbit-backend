const socket = require("socket.io");
const crypto = require("crypto");
const { socketAuth } = require("../middlewares/socketAuth");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connection");

const getSecretRoomId = (userId1, userId2) => {
    return crypto
        .createHash("sha256")
        .update([userId1, userId2].sort().join("_"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    });

    // Verify JWT token during WebSocket handshake
    io.use(socketAuth);

    io.on("connection", (socket) => {
        socket.on("joinChat", async ({ firstName, currentUserId, targetUserId }) => {
            const senderId = socket.user?._id?.toString() || currentUserId;
            const senderName = socket.user?.firstName || firstName;

            // Security guard: verify accepted connection
            const connection = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: senderId, toUserId: targetUserId, status: "accepted" },
                    { fromUserId: targetUserId, toUserId: senderId, status: "accepted" },
                ],
            });

            if (!connection) {
                return socket.emit("chatError", { message: "You can only chat with accepted connections." });
            }

            const roomId = getSecretRoomId(senderId, targetUserId);
            console.log(senderName + " joined room: " + roomId);

            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, currentUserId, targetUserId, text }) => {
            try {
                const senderId = socket.user?._id?.toString() || currentUserId;
                const senderName = socket.user?.firstName || firstName;

                if (!text || !text.trim()) return;

                // Security guard: verify accepted connection
                const connection = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: senderId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: senderId, status: "accepted" },
                    ],
                });

                if (!connection) {
                    return socket.emit("chatError", { message: "Cannot send message: Users are not connected." });
                }

                const roomId = getSecretRoomId(senderId, targetUserId);

                let chat = await Chat.findOne({
                    participants: { $all: [senderId, targetUserId] },
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [senderId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId,
                    text: text.trim(),
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", {
                    firstName: senderName,
                    text: text.trim(),
                    senderId,
                });
            } catch (err) {
                console.error("Error saving/sending chat message:", err);
            }
        });

        socket.on("typing", ({ targetUserId }) => {
            const senderId = socket.user?._id?.toString();
            if (!senderId || !targetUserId) return;
            const roomId = getSecretRoomId(senderId, targetUserId);
            socket.to(roomId).emit("userTyping", { senderId });
        });

        socket.on("stopTyping", ({ targetUserId }) => {
            const senderId = socket.user?._id?.toString();
            if (!senderId || !targetUserId) return;
            const roomId = getSecretRoomId(senderId, targetUserId);
            socket.to(roomId).emit("userStoppedTyping", { senderId });
        });

        socket.on("disconnect", () => { });
    });
};

module.exports = initializeSocket