const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const businessSchema = new Schema(
  {
    capital: Number,
    sales: Number,
    expenses: Number,
    profit: Number,
    day: Date,
    id: Number,
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
