const express = require("express");
const {
  getUser,
  updateUserTitle,
  updateUserPassword,
  updateAvatar,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);
router.patch("/title", updateUserTitle);
router.patch("/", updateUserPassword);
router.patch("/avatar", updateAvatar);

module.exports = router;
