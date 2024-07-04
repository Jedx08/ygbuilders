const express = require("express");
const {
  getAllExpensesData,
  getExpensesData,
  createExpensesData,
  updateExpensesData,
  deleteExpensesData,
} = require("../controllers/personalMonthController");

const router = express.Router();

router.get("/", getAllExpensesData);

router.get("/:id", getExpensesData);

router.post("/", createExpensesData);

router.patch("/:id", updateExpensesData);

router.delete("/:id", deleteExpensesData);

module.exports = router;
