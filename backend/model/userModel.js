const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    useremail: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    instructions: {
      home: Boolean,
      calendarP: Boolean,
      calendarB: Boolean,
      summary: Boolean,
    },
    avatar: String,
    personal_title: String,
    business_title: String,
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
