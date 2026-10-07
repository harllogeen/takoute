import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createCategorySchema, updateCategorySchema } from '../utils/validation';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active } = req.query;

    const categories = await prisma.category.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      include: {
        _count: {
          select: { foodItems: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { foodItems: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
