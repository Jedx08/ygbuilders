const User = require("../model/userModel");
const mongoose = require("mongoose");

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
  const username = req.user;

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

// const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findByIdAndDelete(id);

//   res.status(200).json(user);
// };

module.exports = {
  getUser,
  updateUserTitle,
};
