const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyResetToken = require("../middleware/verifyResetToken");

const handlePasswordReset = async (req, res) => {
  const { token, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password are required" });
  }

  if (!token) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  try {
    const getEmail = await verifyResetToken(token);
    if (getEmail) {
      const foundUser = await User.findOne({ email: getEmail });
      const hashedPassword = await bcrypt.hash(password, 10);

      foundUser.password = hashedPassword;
      foundUser.resetToken = "";
      await foundUser.save();

      res.status(200).json({ message: "Password reset successfully" });
    } else {
      res.status(400).json({ message: "Invalid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server time out" });
  }
};

module.exports = handlePasswordReset;
