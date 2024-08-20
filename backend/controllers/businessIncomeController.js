const Business = require("../model/businessModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const business = await Business.find({ user_id: user._id });
    res.status(200).json(business);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getData = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id);

  res.status(200).json(business);
};

// create data
const createData = async (req, res) => {
  const { capital, sales, expenses, id, day } = req.body;

  const profit = sales - expenses - capital;

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const business = await Business.create({
      user_id: user._id,
      capital,
      sales,
      expenses,
      profit,
      id,
      day,
    });
    res.status(200).json(business);
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
    const business = await Business.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(business);
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

  const business = await Business.findByIdAndDelete({ _id: id });

  res.status(200).json(business);
};

module.exports = {
  getAllData,
  getData,
  createData,
  updateData,
  deleteData,
};
