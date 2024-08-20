const BusinessCapital = require("../model/businessMonthlyCapitalModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllCapitalData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const businessCapital = await BusinessCapital.find({ user_id: user._id });
    res.status(200).json(businessCapital);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getCapitalData = async (req, res) => {
  const { id } = req.params;

  const businessCapital = await BusinessCapital.findById(id);

  res.status(200).json(businessCapital);
};

// create data
const createCapitalData = async (req, res) => {
  const { title, amount, month } = req.body;

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const businessCapital = await BusinessCapital.create({
      user_id: user._id,
      title,
      amount,
      month,
    });
    res.status(200).json(businessCapital);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update data
const updateCapitalData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  try {
    const businessCapital = await BusinessCapital.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(businessCapital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete data
const deleteCapitalData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const businessCapital = await BusinessCapital.findByIdAndDelete({ _id: id });

  res.status(200).json(businessCapital);
};

module.exports = {
  getAllCapitalData,
  getCapitalData,
  createCapitalData,
  updateCapitalData,
  deleteCapitalData,
};
