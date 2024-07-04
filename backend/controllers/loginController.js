const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser)
    return res.status(401).json({
      message: "Your login credentials don't match an account in our system.",
    });
  const _id = foundUser?._id;
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
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
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, _id: _id.toString() });
  } else {
    res.status(401).json({
      message: "Your login credentials don't match an account in our system.",
    });
  }
};

module.exports = handleLogin;
