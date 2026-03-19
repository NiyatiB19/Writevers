import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"WriteVerse Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[EMAIL UTILS] Email sent to ${to}`);
  } catch (error) {
    console.error(`[EMAIL UTILS ERROR] Failed to send email to ${to}:`, error);
    throw error;
  }
};

export default sendEmail;
