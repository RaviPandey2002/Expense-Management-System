const { default: mongoose } = require("mongoose");
const Transaction = require("../models/transactionModel");

const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type, userId } = req.body;

        // Initialize a query object
        let query = {};

        if (userId) {
            query.userId = userId;
        }
        let startDate;
        if (frequency && frequency !== "custom") {
            const today = new Date();
            if (frequency === "7") {
                startDate = new Date();
                startDate.setDate(today.getDate() - 7);
            } else if (frequency === "30") {
                startDate = new Date();
                startDate.setMonth(today.getMonth() - 1);
            } else if (frequency === "365") {
                startDate = new Date();
                startDate.setFullYear(today.getFullYear() - 1); 
            }

            query.date = { $gte: startDate };
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
        if (type && type !== "all") {
            query.type = type; // Filter by transaction type
        }

        // Fetch transactions based on the query
        const Transactions = await Transaction.find(query);
        res.status(200).json(Transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ _id: req.body.transactionId });
        res.status(200).send("Transaction Deleted!");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const editTransaction = async (req, res) => {
    try {
        await Transaction.findOneAndUpdate(
            { _id: req.body.transactionId },
            req.body.payload
        );
        res.status(200).send("Record Edited Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const addTransaction = async (req, res) => {
    try {
        console.log("add transaction req",req.body);
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).send("Transaction Created");
    } catch (error) {
        console.log("Error while Adding Transactions");
        res
            .status(500)
            .json({ message: `Error while Adding Transactions: ${error}` });
    }
};

module.exports = {
    getAllTransaction,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
