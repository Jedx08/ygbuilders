const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalMonthlySchema = new Schema(
  {
    title: String,
    amount: Number,
    month: String,
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalMonth", personalSchema);
