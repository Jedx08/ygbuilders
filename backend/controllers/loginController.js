const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username or Email and Password are required." });

  const foundUser =
    (await User.findOne({ username }).exec()) ||
    (await User.findOne({ useremail: username }).exec());
  if (!foundUser)
    return res.status(401).json({
      message: "Your login credentials don't match an account in our system.",
    });
  const _id = foundUser?._id;
  const useremail = foundUser?.useremail;
  const avatar = foundUser?.avatar;
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username, _id: foundUser._id },
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
      sameSite: "None",
      secure: true,
      maxAge: 168 * 60 * 60 * 1000,
    });

    res.json({ accessToken, useremail, avatar, _id: _id.toString() });
  } else {
    res.status(401).json({
      message: "Your login credentials don't match an account in our system.",
    });
  }
};

module.exports = handleLogin;
