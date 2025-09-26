import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '../models/user';
import redisService from './redis.service';
import { verificationTemplate, resetPasswordTemplate } from '../utils/emailTemplates';
import { sendEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Register a new user
 */
export const register = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || 'user',
  });

  return newUser.toObject();
};

/**
 * Login user
 */
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Send email verification OTP
 */
export const sendVerification = async (email: string): Promise<void> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('User not found');
  if (user.verified) return;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await redisService.setValue(`verify:${email}`, otp, 600);

    await sendEmail(email, 'Verify your eWaste account', verificationTemplate(otp));
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (email: string, otp: string): Promise<void> => {
  const storedOtp = Number(await redisService.getValue<string>(`verify:${email}`));

  if (!storedOtp || storedOtp !== Number(otp)){
    throw new Error('Invalid or expired OTP');
  } 

  await User.updateOne({ email: email.toLowerCase() }, { verified: true });
  await redisService.deleteKey(`verify:${email}`);
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const user: IUser | null = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('User not found');

  const token = uuidv4();
  await redisService.setValue(`reset:${token}`, user._id.toString(), 3600);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(email, 'Password Reset', resetPasswordTemplate(resetLink));
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const userId = await redisService.getValue<string>(`reset:${token}`);
  if (!userId) throw new Error('Invalid or expired token');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  await redisService.deleteKey(`reset:${token}`);
};

/**
 * Get authenticated user profile
 */
export const me = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user.toObject();
};

/**
 * Logout user (blacklist JWT)
 */
export const logout = async (token: string): Promise<void> => {
  if (!token) throw new Error('No token provided');

  const decoded = jwt.decode(token) as { exp?: number };
  const expiry =
    decoded?.exp && decoded.exp > Math.floor(Date.now() / 1000)
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 3600;

  await redisService.setValue(`bl_${token}`, 'true', expiry);
};
