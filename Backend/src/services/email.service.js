const nodemailer = require("nodemailer");


async function sendOtpEmail(toEmail, otpCode) {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      
      console.log("No SMTP credentials found. Creating an Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: '"Daybook Support" <support@daybook.app>',
      to: toEmail,
      subject: "Your Daybook Password Reset Code",
      text: `Your password reset code is: ${otpCode}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: 'Georgia', serif; color: #151311; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #dcc497; background-color: #f5f0e8;">
          <h2 style="color: #29251f; text-align: center; border-bottom: 1px solid #dcc497; padding-bottom: 10px;">Daybook</h2>
          <p>You requested a password reset.</p>
          <p>Your one-time code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; text-align: center; color: #45673f; padding: 20px; border: 1px dashed #434840; background-color: #ede8db;">${otpCode}</h1>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p style="font-size: 12px; color: #7a7a6e; margin-top: 40px; border-top: 1px solid #c8c4b4; padding-top: 10px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    
   
    if (info.messageId && info.messageId.includes("ethereal")) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email.");
  }
}

module.exports = {
  sendOtpEmail,
};
