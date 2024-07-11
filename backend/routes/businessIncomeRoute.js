const express = require("express");
const {
  getAllData,
  getData,
  createData,
  updateData,
  deleteData,
} = require("../controllers/businessIncomeController");

const router = express.Router();

router.get("/", getAllData);

router.get("/:id", getData);

router.post("/", createData);

router.patch("/:id", updateData);

router.delete("/:id", deleteData);

module.exports = router;
