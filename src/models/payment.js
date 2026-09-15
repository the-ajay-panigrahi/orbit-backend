const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["created", "captured", "failed"],
        message: "{VALUE} is invalid status type.",
      },
      default: "created",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    receipt: {
      type: String,
      required: true,
    },
    membershipType: {
      type: String,
      required: true,
      enum: {
        values: ["basic", "pro", "premium"],
        message: "{VALUE} is not a valid membership plan!",
      },
      default: "basic",
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;