const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransaction,
  deleteAllTransactions,
} = require("../controllers/transactionCtrl");

const router = express.Router();

router.post("/add-transaction", addTransaction);
router.post("/edit-transaction", editTransaction);
router.post("/delete-transaction", deleteTransaction);
router.post("/get-transactions", getAllTransaction);
router.post("/delete-all-transactions", deleteAllTransactions);

module.exports = router;

