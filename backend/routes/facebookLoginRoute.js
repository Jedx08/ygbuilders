const express = require("express");
const handleLoginFacebook = require("../controllers/facebookLoginController");
const router = express.Router();

router.post("/", handleLoginFacebook);

module.exports = router;
