const socket = require("socket.io");
const crypto = require("crypto");
const { socketAuth } = require("../middlewares/socketAuth");

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
        socket.on("joinChat", ({ firstName, currentUserId, targetUserId }) => {
            const senderId = socket.user?._id?.toString() || currentUserId;
            const senderName = socket.user?.firstName || firstName;
            const roomId = getSecretRoomId(senderId, targetUserId);
            console.log(senderName + " joined room: " + roomId);

            socket.join(roomId);
        });

        socket.on("sendMessage", ({ firstName, currentUserId, targetUserId, text }) => {
            const senderId = socket.user?._id?.toString() || currentUserId;
            const senderName = socket.user?.firstName || firstName;
            const roomId = getSecretRoomId(senderId, targetUserId);
            console.log(senderName + " sent: " + text);

            io.to(roomId).emit("messageReceived", { firstName: senderName, text });
        });

        socket.on("disconnect", () => { });
    });
};

module.exports = initializeSocket