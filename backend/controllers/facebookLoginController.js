const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const handleLoginFacebook = async (req, res) => {
  const { username, email, facebookId, firstname, lastname, instructions } =
    req.body;

  if (!username || !email)
    return res.status(400).json({ message: "Can't connect to facebook" });

  try {
    const foundUser = await User.findOne({
      email: email.toLowerCase(),
    }).exec();

    //register
    if (!foundUser) {
      const created = await User.create({
        username: username,
        email: email.toLowerCase(),
        instructions: instructions,
        provider: "facebook",
        facebookId,
        firstname,
        lastname,
      });

      if (created) {
        const users = await User.findOne({
          email: email,
        }).exec();

        const accessToken = jwt.sign(
          { username: users.username, _id: users._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30m" }
        );
        const refreshToken = jwt.sign(
          { username: users.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "30d" }
        );
        // saving refresh token with current user
        users.refreshToken = refreshToken;
        await users.save();

        const _id = users?._id.toString();
        const avatar = users?.avatar;
        const instructions = users?.instructions;
        const provider = users?.provider;
        const useremail = users?.email;

        //create secure cookie with refresh token
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 168 * 60 * 60 * 1000,
        });

        console.log("New FB Account: ", email);
        return res.status(200).json({
          accessToken,
          email: useremail,
          avatar,
          _id,
          instructions,
          provider,
        });
      }
    }

    // login
    if (foundUser.facebookId) {
      const _id = foundUser?._id;
      const email = foundUser?.email;
      const avatar = foundUser?.avatar;
      const provider = foundUser?.provider;
      const instructions = foundUser?.instructions;

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

      return res.status(200).json({
        accessToken,
        email,
        avatar,
        _id: _id.toString(),
        instructions,
        provider,
      });
    }

    // link facebook account to current user
    if (foundUser) {
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
      foundUser.facebookId = facebookId;
      foundUser.firstname = firstname;
      foundUser.lastname = lastname;
      foundUser.provider = "linked with facebook";
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

      return res.status(200).json({
        accessToken,
        email: foundUser?.email,
        avatar: foundUser?.avatar,
        _id: foundUser._id.toString(),
        instructions: foundUser?.instructions,
        provider: foundUser?.provider,
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Can't connect to facebook",
    });
  }
};

module.exports = handleLoginFacebook;
