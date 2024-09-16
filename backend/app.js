require("dotenv").config();
const https = require("https");
const http = require("http");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const personalIncome = require("./routes/personalIncomeRoute");
const personalMonthlyExpenses = require("./routes/personalMonthlyExpensesRoute");
const businessIncome = require("./routes/businessIncomeRoute");
const businessMonthlyExpenses = require("./routes/businessMonthlyExpensesRoute");
const businessMonthlyCapital = require("./routes/businessMonthlyCapitalRoute");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const userRoute = require("./routes/userRoute");
const facebookLoginRoute = require("./routes/facebookLoginRoute");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const logoutRoute = require("./routes/logoutRoute");
const cookieParser = require("cookie-parser");
const refreshTokenRoute = require("./routes/refreshTokenRoute");
const verifyJWT = require("./middleware/verifyJWT");

// express app
const app = express();

app.use(express.static("public"));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// connect to MongoDB
connectDB();

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// user/auth routes
app.use("/auth/facebook", facebookLoginRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/refresh", refreshTokenRoute);
app.use("/logout", logoutRoute);

// verify token to access user data
app.use(verifyJWT);

// user data routes
app.use("/api/personal-income", personalIncome);
app.use("/api/personal-expenses", personalMonthlyExpenses);
app.use("/api/business-income", businessIncome);
app.use("/api/business-expenses", businessMonthlyExpenses);
app.use("/api/business-capital", businessMonthlyCapital);

// user route
app.use("/user", userRoute);

// connect to DB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log("listening to port", process.env.PORT);
  });
});
