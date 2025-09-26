import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // set secure true if port is 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certificates
  },
});


export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  await transporter.sendMail({
    from: `support@bitminersfx.com`,
    to,
    subject,
    text,
    html,
  });
};
