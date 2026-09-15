const express = require("express")
const { createPaymentOrder } = require("../controllers/paymentController")
const { userAuth } = require("../middlewares/auth")
const paymentRouter = express.Router()

paymentRouter.post("/payment/create", userAuth, createPaymentOrder)

module.exports = paymentRouter