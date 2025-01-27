var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "privateemail",
  auth: {
    user: "noreply@yourgross.ph",
    pass: process.env.EMAIL_RESET_PASSWORD,
  },
});

var mailOptions = {
  from: "noreply@yourgross.ph",
  to: "myfriend@yahoo.com",
  subject: "Reset your password",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
