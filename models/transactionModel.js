const mongoose = require("mongoose");
const users = require("./userModel");

const TransactionSchema = new mongoose.Schema(
  {
    userid: {
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
    refrence: {
      type: String,
    },
    description: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("TransactionModel", TransactionSchema);
module.exports = Transaction;
