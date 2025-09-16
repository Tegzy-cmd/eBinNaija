export const verificationTemplate = (otp: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Verify your eWaste account</h2>
    <p>Your OTP is:</p>
    <h1 style="color: #2c7;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  </div>
`;

export const resetPasswordTemplate = (link: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${link}" style="background:#2c7;color:white;padding:10px 20px;text-decoration:none;">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  </div>
`;
