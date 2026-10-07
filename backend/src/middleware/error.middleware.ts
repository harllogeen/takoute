import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      return res.status(409).json({
        success: false,
        error: `A record with this ${field} already exists`
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        error: 'Referenced record does not exist'
      });
    }
  }

  // Default error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
