const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalSchema = new Schema(
  {
    gross: Number,
    expenses: Number,
    day: Date,
    net: Number,
    id: Number,
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Personal", personalSchema);
