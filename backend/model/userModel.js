const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: function () {
      //   return !this.facebookId; // Only required if not using Facebook login,
      // },
    },
    firstname: String,
    lastname: String,
    facebookId: String, // For Facebook login
    provider: {
      type: String,
      default: "yourgross", // 'local' for email/password, 'facebook' for Facebook
    },
    instructions: {
      home: Boolean,
      calendarP: Boolean,
      calendarB: Boolean,
      summary: Boolean,
      savings: Boolean,
    },
    avatar: {
      type: String,
      default: "avatar1", // 'local' for email/password, 'facebook' for Facebook
    },
    personal_title: String,
    business_title: String,
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
