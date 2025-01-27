const jwt = require("jsonwebtoken");

const verifyResetToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.RESET_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        resolve(false);
      } else {
        try {
          resolve(decoded.email);
        } catch (error) {
          resolve(false);
        }
      }
    });
  });
};

module.exports = verifyResetToken;
