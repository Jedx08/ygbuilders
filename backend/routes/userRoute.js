const express = require("express");
const {
  getUser,
  updateUserTitle,
  updateUserPassword,
  updateAvatar,
  toggleInstructions,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);
router.patch("/title", updateUserTitle);
router.patch("/", updateUserPassword);
router.patch("/avatar", updateAvatar);
router.patch("/instructions", toggleInstructions);
router.delete("/deleteUser", deleteUser);

module.exports = router;
