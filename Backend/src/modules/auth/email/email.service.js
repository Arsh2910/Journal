const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config({
  path: "C:\Users\Arsh\Code-NodeJs\BACKEND PROJECTS\Journal\Backend\src\config\.env",
});
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail(email, otp) {
  const { error } = await resend.emails.send({
    from: "DayBook <onboarding@arsh02.me>",
    to: email,
    subject: "Your DayBook OTP",
    text: `Your DayBook verification code is ${otp}. It will expire in 5 minutes.`,
    html: `
      <div>
        <h2>DayBook</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
  });

  if (error) throw error;
}

module.exports = { sendOtpEmail };
