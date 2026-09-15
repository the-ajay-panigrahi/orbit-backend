const Payment = require("../models/payment");
const razorpayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");

const createPaymentOrder = async (req, res) => {
  try {
    const { membershipType } = req.body;
    const loggedInUser = req.user;

    if (!membershipType || !["pro", "premium"].includes(membershipType)) {
      if (membershipType === "basic") {
        throw new Error("Basic plan is free and does not require payment.");
      }
      throw new Error("Invalid membership type! Choose either 'pro' or 'premium'.");
    }

    const amount = membershipAmount[membershipType];
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: loggedInUser._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      membershipType,
      notes: {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        membershipType,
      },
    });

    const savedPayment = await payment.save();

    res.status(200).json({
      message: "Payment order created successfully",
      data: {
        ...savedPayment.toObject(),
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to create payment order",
    });
  }
};

module.exports = { createPaymentOrder };