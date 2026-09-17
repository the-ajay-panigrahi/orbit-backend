const jwt = require("jsonwebtoken");
const User = require("../models/user");

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [key, ...value] = cookie.split("=");
      return [key, value.join("=")];
    })
  );
};

const socketAuth = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers?.cookie;
    const cookies = parseCookies(rawCookies);
    const token = cookies.token || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication failed: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return next(new Error("Authentication failed: User not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication failed: " + (err.message || "Invalid token")));
  }
};

module.exports = { socketAuth };
