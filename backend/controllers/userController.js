const User = require("../model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Business = require("../model/businessModel");
const BusinessCapital = require("../model/businessMonthlyCapitalModel");
const BusinessMonth = require("../model/businessMonthlyExpensesModel");
const Personal = require("../model/personalModel");
const PersonalMonth = require("../model/personalMonthlyExpensesModel");
const nodemailer = require("nodemailer");

// const getAllUsers = async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

const deleteUser = async (req, res) => {
  const _id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  } else {
    try {
      const foundUser = await User.findById(_id);

      await Business.deleteMany({ user_id: _id });
      await BusinessCapital.deleteMany({ user_id: _id });
      await BusinessMonth.deleteMany({ user_id: _id });
      await Personal.deleteMany({ user_id: _id });
      await PersonalMonth.deleteMany({ user_id: _id });

      const deleteUser = await User.findByIdAndDelete(_id);
      if (!deleteUser)
        return res.status(404).json({ message: "User not found" });

      res.clearCookie("token");

      const transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noreply@yourgross.ph",
          pass: process.env.EMAIL_RESET_PASSWORD,
        },
      });

      const mailOptions = {
        from: "noreply@yourgross.ph",
        to: foundUser.email,
        subject: "Account Deletion Confirmation for YourGross",
        html: `<div
      style="
        font-family: 'Poppins', sans-serif;
        color: #5e6278;
        background-color: #f9fafb;
        padding: 6px 0px;
      "
    >
      <div
        style="
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          margin-top: 10px;
        "
      >
        <a href="https://yourgross.ph/"
          ><div
            style="width: fit-content; margin-left: auto; margin-right: auto"
          >
            <img
              src="https://yourgross.ph/assets/YG_LOGO-C5nBHFwa.png"
              width="44"
              height="44"
            /></div
        ></a>

        <div style="width: fit-content">
          <div
            style="
              color: #2ec4b6;
              text-align: center;
              font-size: 26px;
              font-weight: 800;
            "
          >
            Your<span style="color: #ff9f1c">Gross</span>
          </div>
        </div>
      </div>

      <div
        style="
          width: 70%;
          margin-left: auto;
          margin-right: auto;
          font-size: 15px;
          max-width: 600px;
          background-color: #ffffff;
          padding: 3px 10px;
          border-radius: 6px;
        "
      >
        <p>Dear ${capitalizeFirstLetter(foundUser.username)},</p>
        <p>
          We wanted to confirm that your account has been successfully deleted
          from our system. As requested, all your data has been permanently
          removed.
        </p>
        <p>
          We're sorry to see you go and would appreciate any feedback you might
          have. If you have any questions or need further assistance, please
          feel free to reach out to us at
          <span
            ><a href="mailto:support@yourgross.ph"
              >support@yourgross.ph</a
            ></span
          >.
        </p>
        <p>Thank you for using our income tracking tool.</p>
        <p>Best regards, YourGross Team</p>
      </div>

      <p style="text-align: center; font-size: 15px">
        <a
          href="https://yourgross.ph/"
          style="color: #a1a5b7; text-align: center"
          >Visit YourGross PH</a
        >
      </p>
    </div>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).json({ message: "Account Succesfully Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = {
  getUser,
  updateUserTitle,
  updateUserPassword,
  updateAvatar,
  toggleInstructions,
  deleteUser,
};
