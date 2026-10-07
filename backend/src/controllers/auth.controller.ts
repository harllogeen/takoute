import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { registerSchema, loginSchema } from '../utils/validation';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: existingUser.email === validatedData.email 
          ? 'Email already registered' 
          : 'Phone number already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
