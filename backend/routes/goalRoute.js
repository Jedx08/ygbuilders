const express = require("express");
const {
  getAllGoalData,
  getGoalData,
  createGoalData,
  updateGoalData,
  deleteGoalData,
} = require("../controllers/goalController");

const router = express.Router();

router.get("/", getAllGoalData);

router.get("/:id", getGoalData);

router.post("/", createGoalData);

router.patch("/:id", updateGoalData);

router.delete("/:id", deleteGoalData);

module.exports = router;
