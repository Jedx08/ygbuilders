const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const savingsSchema = new Schema(
  {
    amount: Number,
    day: Date,
    id: Number,
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Savings", savingsSchema);
