const Savings = require("../model/savingsModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const savings = await Savings.find({ user_id: user._id });
    res.status(200).json(savings);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getData = async (req, res) => {
  const { id } = req.params;

  const savings = await Savings.findById(id);

  res.status(200).json(savings);
};

// create data
const createData = async (req, res) => {
  const { amount, id, day } = req.body;

  if (!amount) {
    res.status(400).json({ message: "Amount is required" });
  }

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const savings = await Savings.create({
      user_id: user._id,
      amount,
      id,
      day,
    });
    res.status(200).json(savings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update data
const updateData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  try {
    const savings = await Savings.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(savings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete data
const deleteData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const savings = await Savings.findByIdAndDelete({ _id: id });

  res.status(200).json(savings);
};

module.exports = {
  getAllData,
  getData,
  createData,
  updateData,
  deleteData,
};
