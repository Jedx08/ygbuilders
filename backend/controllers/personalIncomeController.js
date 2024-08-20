const Personal = require("../model/personalModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllData = async (req, res) => {
  const users = req.user.username;

  try {
    const user = await User.findOne({ username: users }).select("_id");
    const personal = await Personal.find({ user_id: user._id });
    res.status(200).json(personal);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get single data
const getData = async (req, res) => {
  const { id } = req.params;

  const personal = await Personal.findById(id);

  res.status(200).json(personal);
};

// create data
const createData = async (req, res) => {
  const { gross, expenses, id, day } = req.body;

  const net = gross - expenses;

  try {
    const users = req.user.username;
    const user = await User.findOne({ username: users }).select("_id");
    const personal = await Personal.create({
      user_id: user._id,
      gross,
      expenses,
      net,
      id,
      day,
    });
    res.status(200).json(personal);
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
    const personal = await Personal.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(personal);
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

  const personal = await Personal.findByIdAndDelete({ _id: id });

  res.status(200).json(personal);
};

module.exports = {
  getAllData,
  getData,
  createData,
  updateData,
  deleteData,
};
