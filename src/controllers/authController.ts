import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * Register user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.register({ name, email, password, role });
    res.status(201).json({ success: true, message: 'User registered', data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login({ email, password });
    res.status(200).json({ success: true, token });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Send email verification
 */
export const sendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.sendVerification(email);
    res.status(200).json({ success: true, message: 'Verification OTP sent' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyEmail(email, otp);
    res.status(200).json({ success: true, message: 'Email verified' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({ success: true, message: 'Password reset link sent' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get current user
 */
export const me = async (req: Request, res: Response) => {
  try {
    // @ts-expect-error: userId injected by auth middleware
    const userId = req.userId;
    const user = await authService.me(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    await authService.logout(token);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
