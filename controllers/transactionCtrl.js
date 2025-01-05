const { default: mongoose } = require("mongoose");
const Transaction = require("../models/transactionModel");
const moment = require("moment");

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type, userId } = req.body;
    console.log("req.body", req.body);

    // Initialize a query object
    let query = {};

    // Check if userId is provided and convert it to ObjectId (if it is a valid ObjectId string)
    if (userId) {
      query.userId = mongoose.Types.ObjectId(userId);  // Convert userId to ObjectId
    }

    // Handling frequency filter (e.g., Last 1 Week, Last 1 Month, etc.)
    if (frequency && frequency !== "custom") {
      const today = new Date();
      let startDate;

      // Set the start date based on the frequency
      if (frequency === "7") {
        startDate = new Date(today.setDate(today.getDate() - 7)); // Last 1 Week
      } else if (frequency === "30") {
        startDate = new Date(today.setMonth(today.getMonth() - 1)); // Last 1 Month
      } else if (frequency === "365") {
        startDate = new Date(today.setFullYear(today.getFullYear() - 1)); // Last 1 Year
      }

      query.date = { $gte: startDate }; // Filter transactions after the start date
    }

    // Handling custom date range filter
    if (frequency === "custom" && selectedDate && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate;

      // Ensure that selectedDate is converted to JavaScript Date objects if it's in moment format
      const start = new Date(startDate);
      const end = new Date(endDate);

      query.date = { $gte: start, $lte: end }; // Custom date range filter
    }

    // Handling type filter (if applicable)
    if (type) {
      query.type = type; // Filter by transaction type
    }

    // Fetch transactions based on the query
    const Transactions = await Transaction.find({userId: userId })
    console.log("query:", query);
    console.log("Filtered Transactions:", Transactions);

    res.status(200).json(Transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.body.TransactionId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndUpdate(
      { _id: req.body.TransactionId },
      req.body.payload
    );
    res.status(200).send("Edit SUccessfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    console.log("req.body-Transaction", req.body);
    await newTransaction.save();
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.log("Error while Adding Transactions");
    res.status(500).json({message:`Error while Adding Transactions: ${error}`});
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
