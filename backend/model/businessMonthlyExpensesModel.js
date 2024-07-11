const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const businessMonthlyExpensesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BusinessMonthlyExpenses",
  businessMonthlyExpensesSchema
);
