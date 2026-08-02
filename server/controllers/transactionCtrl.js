const Transaction = require("../models/transactionModel");

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_TYPES      = ["income", "expense"];
const VALID_CATEGORIES = [
  "salary", "tip", "project", "groceries", "food",
  "movie", "bills", "medical", "fee", "tax", "other",
];

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(String(id));

// ── Controllers ───────────────────────────────────────────────────────────────

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const userId = req.userId;

    const query = { userId };

    if (frequency && frequency !== "custom") {
      const start = new Date();
      if      (frequency === "7")   start.setDate(start.getDate() - 7);
      else if (frequency === "30")  start.setMonth(start.getMonth() - 1);
      else if (frequency === "365") start.setFullYear(start.getFullYear() - 1);
      query.date = { $gte: start };
    }

    if (frequency === "custom" && Array.isArray(selectedDate) && selectedDate.length === 2) {
      const start = new Date(selectedDate[0]);
      const end   = new Date(selectedDate[1]);
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ success: false, message: "Invalid date range" });
      }
      query.date = { $gte: start, $lte: end };
    }

    if (type && type !== "all") {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ success: false, message: "Invalid transaction type" });
      }
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ success: false, message: "amount, type, category and date are required" });
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "amount must be a positive number" });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of: ${VALID_TYPES.join(", ")}` });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid category: ${category}` });
    }
    if (isNaN(new Date(date))) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const newTransaction = new Transaction({
      amount: Number(amount),
      type,
      category,
      description: description || "No description",
      date: new Date(date),
      userId: req.userId,
    });

    await newTransaction.save();
    res.status(201).json({ success: true, message: "Transaction created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add transaction" });
  }
};

const editTransaction = async (req, res) => {
  try {
    const { transactionId, payload } = req.body;

    if (!transactionId || !isValidObjectId(transactionId)) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });
    }
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, message: "payload is required" });
    }

    // Only allow known fields to be updated
    const { amount, type, category, description, date } = payload;
    const update = {};

    if (amount !== undefined) {
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: "amount must be a positive number" });
      }
      update.amount = Number(amount);
    }
    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ success: false, message: `type must be one of: ${VALID_TYPES.join(", ")}` });
      }
      update.type = type;
    }
    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({ success: false, message: "category cannot be empty" });
      }
      update.category = category.trim();
    }
    if (description !== undefined) update.description = description;
    if (date !== undefined) {
      if (isNaN(new Date(date))) {
        return res.status(400).json({ success: false, message: "Invalid date" });
      }
      update.date = new Date(date);
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: req.userId },
      update,
      { runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId || !isValidObjectId(transactionId)) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });
    }

    const deleted = await Transaction.findOneAndDelete({ _id: transactionId, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete transaction" });
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
