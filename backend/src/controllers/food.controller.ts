import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createFoodSchema, updateFoodSchema } from '../utils/validation';

export const getFoods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, categoryId, available, search, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma where clause — works on both SQLite and PostgreSQL
    const where: any = {};

    if (category) {
      where.categoryId = category;
    } else if (categoryId) {
      where.categoryId = categoryId;
    }

    if (available === 'true') {
      where.isAvailable = true;
    }

    if (search && (search as string).trim() !== '') {
      const searchTerm = (search as string).trim();
      where.OR = [
        { name:        { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const [foods, total] = await Promise.all([
      prisma.foodItem.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } }
        },
        skip,
        take: limitNum,
        orderBy: { name: 'asc' }
      }),
      prisma.foodItem.count({ where })
    ]);

      // Get categories for the foods
    res.status(200).json({
      success: true,
      data: {
        foods,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFoodById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const food = await prisma.foodItem.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } }
    });

    if (!food) {
      res.status(404).json({ success: false, error: 'Food item not found' });
      return;
    }

    res.status(200).json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createFoodSchema.parse(req.body);

    const food = await prisma.foodItem.create({
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: food,
      message: 'Food item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateFoodSchema.parse(req.body);

    const food = await prisma.foodItem.update({
      where: { id },
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: food,
      message: 'Food item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.foodItem.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
