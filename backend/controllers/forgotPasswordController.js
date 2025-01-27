const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const handleForgotPassword = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Username or Email are required." });
  }

  try {
    const foundUser =
      (await User.findOne({ username: username.toLowerCase() }).exec()) ||
      (await User.findOne({ email: email.toLowerCase() }).exec());
    if (!foundUser) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      const resetToken = jwt.sign(
        { email: foundUser.email, _id: foundUser._id },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundUser.resetToken = resetToken;
      await foundUser.save();

      //send email with reset link to user
      // console.log(
      //   "Reset link",
      //   `http://localhost:5173/reset-password?resetToken=${resetToken}`
      // );

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
        subject: "Reset Your Password for YourGross",
        html: `
         <div
      style="
        font-family: 'Poppins', sans-serif;
        color: #5e6278;
        background-color: #f9fafb;
        padding: 6px 0px;
      "
    >
      <div style="width: fit-content; margin-left: auto; margin-right: auto; margin-top: 10px;">
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
        <p>
          ${foundUser.username}, in order to reset your password at
          <span style="color: #181c32"
            ><a
              href="https://yourgross.ph/"
              style="color: #181c32; text-decoration: none"
              >YourGross</a
            ></span
          >, you need to click the button below. This will allow you to choose a
          new password. Please note that this reset password link is valid for 24 hours.
        </p>
        <div
          style="
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            margin-top: 30px;
          "
        >
          <a
            href="http://localhost:5173/reset-password?resetToken=${resetToken}"
            style="text-decoration: none; color: #ffffff"
          >
            <div
              style="
                background-color: #ff9f1c;
                width: fit-content;
                padding: 6px 7px;
                border-radius: 3px;
              "
            >
              Reset password
            </div></a
          >
        </div>
        <p style="margin-top: 30px">
          If you did not request this email, you may safely ignore it.
        </p>
        <p>
          If you have any questions or need assistance, feel free to contact our
          support team at
          <span
            ><a href="mailto:support@yourgross.ph"
              >support@yourgross.ph</a
            ></span
          >.
        </p>
        <p>Best regards, YourGross Team</p>
      </div>

      <p style="text-align: center; font-size: 15px">
        <a
          href="https://yourgross.ph/"
          style="color: #a1a5b7; text-align: center"
          >Visit YourGross PH</a
        >
      </p>
    </div>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res
        .status(200)
        .json({
          message:
            "Check your email for instructions to reset your password. If you don't see the email, be sure to check your spam folder",
        });
    }
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleForgotPassword;
