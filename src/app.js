require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const { createServer } = require("http");
const initializeSocket = require("./utils/socket");
require("./utils/cronJob");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = createServer(app);
initializeSocket(server)

ConnectDB()
  .then(() => {
    console.log("DB connection established successfully!");
    server.listen(PORT, () => {
      console.log(`Server is successfully running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed!!", error);
  });
