const User = require("../models/user");
const Payment = require("../models/payment");
const razorpayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

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

const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const loggedInUser = req.user;

    if (!orderId || !paymentId || !signature) {
      throw new Error("orderId, paymentId, and signature are all required!");
    }

    // 1. Verify HMAC signature using Razorpay Key Secret
    const isValid = validatePaymentVerification(
      { order_id: orderId, payment_id: paymentId },
      signature,
      process.env.RAZORPAY_KEY_SECRET,
    );

    if (!isValid) {
      const payment = await Payment.findOne({ orderId });
      if (payment) {
        payment.status = "failed";
        payment.paymentId = paymentId;
        await payment.save();
      }
      return res.status(400).json({ error: "Invalid payment signature!" });
    }

    // 2. Find payment record and update status
    const payment = await Payment.findOne({ orderId, userId: loggedInUser._id });
    if (!payment) {
      throw new Error("Payment record not found for this user!");
    }

    payment.status = "captured";
    payment.paymentId = paymentId;
    await payment.save();

    // 3. Upgrade user membership
    const user = await User.findById(loggedInUser._id).select("-password");
    if (user) {
      user.membershipType = payment.membershipType;
      await user.save();
    }

    res.status(200).json({
      message: "Payment verified successfully!",
      data: {
        payment,
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Payment verification failed!",
    });
  }
};

const paymentWebhook = async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const rawPayload = req.rawBody || JSON.stringify(req.body);

    const isWebhookValid = validateWebhookSignature(
      rawPayload,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body?.event;
    const paymentDetails = req.body?.payload?.payment?.entity;

    if (event === "payment.captured") {
      const payment = await Payment.findOne({ orderId: paymentDetails?.order_id });
      if (payment) {
        payment.status = "captured";
        payment.paymentId = paymentDetails.id;
        await payment.save();

        const user = await User.findById(payment.userId);
        if (user) {
          user.membershipType = payment.membershipType;
          await user.save();
        }
      }
    } else if (event === "payment.failed") {
      const payment = await Payment.findOne({ orderId: paymentDetails?.order_id });
      if (payment) {
        payment.status = "failed";
        payment.paymentId = paymentDetails.id;
        await payment.save();
      }
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment, paymentWebhook };