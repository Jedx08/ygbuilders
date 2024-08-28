const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { username, email, password, avatar } = req.body;
  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: "Username, Email and Password are required." });

  // check for duplicate usernames in DB
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate)
    return res.status(409).json({ message: `${username} is already in used` }); // conflict

  // check for duplicate useremail in DB
  const duplicateEmail = await User.findOne({ useremail: email }).exec();
  if (duplicateEmail)
    return res.status(409).json({ message: `Email is already in used` }); // conflict

  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and store the new user
    const created = await User.create({
      username: username,
      useremail: email,
      password: hashedPassword,
      avatar: avatar,
    });
    // res.status(201).json({ success: `New user ${username} created!` });

    // Test Reg and AccessToken

    if (created) {
      const foundUser =
        (await User.findOne({ username }).exec()) ||
        (await User.findOne({ useremail }).exec());
      const _id = foundUser?._id;
      const useremail = foundUser?.useremail;
      const avatar = foundUser?.avatar;
      const accessToken = jwt.sign(
        { username: foundUser.username, _id: _id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      // saving refresh token with current user
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      //create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 168 * 60 * 60 * 1000,
      });

      console.log("New Account: ", username);
      res.json({ accessToken, useremail, avatar, _id: _id.toString() });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleRegister;
