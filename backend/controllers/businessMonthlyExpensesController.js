const BusinessMonth = require("../model/businessMonthlyExpensesModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllExpensesData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const businessMonth = await BusinessMonth.find({ user_id: user._id });
    res.status(200).json(businessMonth);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getExpensesData = async (req, res) => {
  const { id } = req.params;

  const businessMonth = await BusinessMonth.findById(id);

  res.status(200).json(businessMonth);
};

// create data
const createExpensesData = async (req, res) => {
  const { title, amount, month } = req.body;

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const businessMonth = await BusinessMonth.create({
      user_id: user._id,
      title,
      amount,
      month,
    });
    res.status(200).json(businessMonth);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update data
const updateExpensesData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  try {
    const businessMonth = await BusinessMonth.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(businessMonth);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete data
const deleteExpensesData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const businessMonth = await BusinessMonth.findByIdAndDelete({ _id: id });

  res.status(200).json(businessMonth);
};

module.exports = {
  getAllExpensesData,
  getExpensesData,
  createExpensesData,
  updateExpensesData,
  deleteExpensesData,
};
