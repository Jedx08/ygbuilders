const path = require("path");
const allowedOrigins = require("../config/allowedOrigins");

// CORS
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  } else {
    return res
      .status(403)
      .sendFile(path.join(__dirname, "../", "public", "error.html"));
  }
  next();
};

module.exports = credentials;
