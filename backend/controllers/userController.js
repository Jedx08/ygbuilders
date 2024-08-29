const User = require("../model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const getAllUsers = async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const user = await User.findById(id);

  res.status(200).json(user);
};

const updateUserTitle = async (req, res) => {
  const username = req.user.username;

  if (!req.body) {
    res.status(400).json({ message: "Please fill out the form" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({
      username: user.username,
      personal_title: user.personal_title,
      business_title: user.business_title,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUserPassword = async (req, res) => {
  const users = await User.findById(req.user._id).select("password");

  if (!req.body.password) {
    return res.status(400).json({ message: "Current password required" });
  }

  const match = await bcrypt.compare(req.body.password, users?.password);

  if (!match) {
    return res.status(409).json({ message: "Incorrect current password" });
  }

  if (!req.body.newPassword) {
    return res.status(400).json({ message: "New password required" });
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).json({ message: "New password does not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body?.newPassword, 10);

    users.password = hashedPassword;

    await users.save();
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAvatar = async (req, res) => {
  const users = await User.findById(req.user._id).select("avatar");

  if (!req.body.avatar) {
    return res.status(400).json({ message: "Please Select an avatar" });
  }

  try {
    users.avatar = req.body.avatar;

    await users.save();
    res.status(200).json({ avatar: users.avatar, message: "Avatar updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const toggleInstructions = async (req, res) => {
  const username = req.user.username;

  if (!req.body) {
    res.status(400).json({ message: "Bad Request" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(user.instructions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findByIdAndDelete(id);

//   res.status(200).json(user);
// };

module.exports = {
  getUser,
  updateUserTitle,
  updateUserPassword,
  updateAvatar,
  toggleInstructions,
};
