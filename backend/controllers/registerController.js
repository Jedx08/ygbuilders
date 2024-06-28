const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  // check for duplicate usernames in DB
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate)
    return res.status(409).json({ message: `${username} is already in use.` }); // conflict

  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and store the new user
    const created = await User.create({
      username: username,
      password: hashedPassword,
    });
    // res.status(201).json({ success: `New user ${username} created!` });

    // Test Reg and AccessToken

    if (created) {
      const foundUser = await User.findOne({ username }).exec();
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // saving refresh token with current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      //create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log("New Account: ", username);
      res.json({ accessToken });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleRegister;
