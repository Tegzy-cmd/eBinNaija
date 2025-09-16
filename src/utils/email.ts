import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // set secure true if port is 465
    auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASSWORD as string,
    },
    tls: {
        rejectUnauthorized: false, // allow self-signed certificates

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
