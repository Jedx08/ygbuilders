const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // original status code 401
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //forbidden
  const _id = foundUser?._id;
  const useremail = foundUser?.useremail;
  const avatar = foundUser?.avatar;

  //create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 168 * 60 * 60 * 1000,
  });

  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: decoded.username, _id: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    res.json({ accessToken, useremail, avatar, _id: _id.toString() });
  });
};

module.exports = handleRefreshToken;
