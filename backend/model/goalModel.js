const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    totalDays: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("goal", goalSchema);
