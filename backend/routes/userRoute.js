const express = require("express");
const {
  getUser,
  updateUserTitle,
  updateUserPassword,
  updateAvatar,
  toggleInstructions,
  deleteUser,
  clearData,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);
router.patch("/title", updateUserTitle);
router.patch("/", updateUserPassword);
router.patch("/avatar", updateAvatar);
router.patch("/instructions", toggleInstructions);
router.delete("/deleteUser", deleteUser);
router.delete("/clear-data/:data", clearData);

module.exports = router;
