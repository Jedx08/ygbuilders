const Personal = require("../model/personalModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");

// get all data
const getAllData = async (req, res) => {
  const user_id = req.user._id;

  const personal = await Personal.find({ user_id });

  res.status(200).json(personal);
};

// get single data
const getData = async (req, res) => {
  const { id } = req.params;

  const personal = await Personal.findById(id);

  res.status(200).json(personal);
};

// create data
const createData = async (req, res) => {
  const { gross, expenses, id, day, username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Bad request" });
  }

  const net = gross - expenses;

  try {
    const personal = await Personal.create({
      username,
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

  const personal = await Personal.findByIdAndUpdate(id, {
    ...req.body,
  });

  res.status(200).json(personal);
};

// delete data
const deleteData = async (req, res) => {
  const { id } = req.params;

  const personal = await Personal.findByIdAndDelete(id);

  res.status(200).json(personal);
};

module.exports = {
  getAllData,
  getData,
  createData,
  updateData,
  deleteData,
};
