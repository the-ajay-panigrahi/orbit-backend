const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
  paymentWebhook,
} = require("../controllers/paymentController");
const { userAuth } = require("../middlewares/auth");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, createPaymentOrder);
paymentRouter.post("/payment/verify", userAuth, verifyPayment);
paymentRouter.post("/payment/webhook", paymentWebhook);

module.exports = paymentRouter;