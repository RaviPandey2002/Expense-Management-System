const mongoose = require("mongoose");
const users = require("./userModel");

const VALID_TYPES = ["income", "expense"];

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: users,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "amount must be a positive number"],
    },
    type: {
      type: String,
      required: true,
      enum: { values: VALID_TYPES, message: "Invalid transaction type" },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
