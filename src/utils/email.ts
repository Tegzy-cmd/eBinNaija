import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true, // set secure true if port is 465
  auth: {
    user: 'support@bitminersfx.com',
    pass: 'Benjamin007$',
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certificates
  },
});

// SMTP_HOST=smtp.titan.email
// SMTP_PORT=465
// SMTP_USER=support@bitminersfx.com
// SMTP_PASSWORD=Benjamin007$

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  await transporter.sendMail({
    from: `support@bitminersfx.com`,
    to,
    subject,
    text,
    html,
  });
};
