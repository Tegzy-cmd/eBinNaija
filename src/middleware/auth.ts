import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import redis from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    // 🔒 Check if blacklisted
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token expired or blacklisted' });
    }

    // ✅ Verify & decode token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = { id: decoded.id, role: decoded.role }; // 👈 add proper typing instead of `any`

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
