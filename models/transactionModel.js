const mongoose = require("mongoose");
const users = require("./userModel");

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: users,
      required: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
