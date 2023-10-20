
// details of mail sender and the mail configuration.
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Use Gmail SMTP server
  port: 587,  // Port for TLS
  secure: false,  // Use TLS, set to false for port 587
  auth: {
    user: 'jyotishreejp24@gmail.com',  // Your Gmail email address
    pass: 'twaqsqehkfkuftko'  // Your Gmail application-specific password
  }
});

module.exports = transporter;

