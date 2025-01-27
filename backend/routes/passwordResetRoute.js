const express = require("express");
const handlePasswordReset = require("../controllers/passwordResetController");
const router = express.Router();

router.post("/", handlePasswordReset);

module.exports = router;
