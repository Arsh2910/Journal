const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    type: "OAuth2",
    user: process.env.SMTP_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: `"DayBook" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your DayBook OTP",
    text: `Your DayBook verification code is ${otp}. It will expire in 5 minutes.`,
    html: `
      <div>
        <h2>DayBook</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOtpEmail,
};
