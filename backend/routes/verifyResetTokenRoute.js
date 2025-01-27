const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyResetToken = require("../middleware/verifyResetToken");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Missing required paramaters" });
  } else {
    try {
      const isTokenValid = await verifyResetToken(token);
      if (!isTokenValid) {
        res.status(400).json({ message: "Invalid Token" });
      } else {
        const foundUser = await User.findOne({ email: isTokenValid });

        if (foundUser.resetToken !== token) {
          res.status(401).json({ message: "Password Reset Token Expired" });
        } else {
          res.status(200).json({ message: "Token is valid" });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Server time out" });
    }
  }
});

module.exports = router;
