const express = require("express");
const { getUser, updateUserTitle } = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);

router.patch("/title", updateUserTitle);

module.exports = router;
