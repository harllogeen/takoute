import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const generateToken = (payload: TokenPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, jwtSecret) as TokenPayload;
};
