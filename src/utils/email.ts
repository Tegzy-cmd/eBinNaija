import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or "SendGrid", "Mailgun", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  await transporter.sendMail({
    from: `"eWaste Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
