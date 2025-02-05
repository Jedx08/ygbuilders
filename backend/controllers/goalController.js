const Goal = require("../model/goalModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllGoalData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const goal = await Goal.find({ user_id: user._id });
    res.status(200).json(goal);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getGoalData = async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  res.status(200).json(goal);
};

// create data
const createGoalData = async (req, res) => {
  const { title, amount, startDate, endDate, totalDays } = req.body;

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const goal = await Goal.create({
      user_id: user._id,
      title,
      amount,
      startDate,
      endDate,
      totalDays,
    });
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update data
const updateGoalData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  try {
    const goal = await Goal.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete data
const deleteGoalData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const goal = await Goal.findByIdAndDelete({ _id: id });

  res.status(200).json(goal);
};

module.exports = {
  getAllGoalData,
  getGoalData,
  createGoalData,
  updateGoalData,
  deleteGoalData,
};
