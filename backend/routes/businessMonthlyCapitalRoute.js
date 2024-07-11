const express = require("express");
const {
  getAllCapitalData,
  getCapitalData,
  createCapitalData,
  updateCapitalData,
  deleteCapitalData,
} = require("../controllers/businessMonthlyCapitalController");

const router = express.Router();

router.get("/", getAllCapitalData);

router.get("/:id", getCapitalData);

router.post("/", createCapitalData);

router.patch("/:id", updateCapitalData);

router.delete("/:id", deleteCapitalData);

module.exports = router;
