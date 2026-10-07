import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createFoodSchema, updateFoodSchema } from '../utils/validation';

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, categoryId, available, search, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let where: any = {};

    // Support both 'category' and 'categoryId' parameters
    if (category) {
      where.categoryId = category;
    } else if (categoryId) {
      where.categoryId = categoryId;
    }

    if (available === 'true') {
      where.isAvailable = true;
    }

    // For search, we need to handle case-insensitive search for SQLite
    let foods;
    let total;

    if (search && (search as string).trim() !== '') {
      const searchTerm = `%${(search as string).toLowerCase()}%`;
      
      // Build WHERE clause for SQL
      let sqlWhere = 'WHERE (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      const params: any[] = [searchTerm, searchTerm];
      
      if (where.categoryId) {
        sqlWhere += ' AND categoryId = ?';
        params.push(where.categoryId);
      }
      
      if (where.isAvailable !== undefined) {
        sqlWhere += ' AND isAvailable = ?';
        params.push(where.isAvailable ? 1 : 0);
      }

      // Get foods with search
      const rawFoods: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM food_items ${sqlWhere} ORDER BY name ASC LIMIT ? OFFSET ?`,
        ...params,
        limitNum,
        skip
      );

      // Get count
      const countResult: any[] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM food_items ${sqlWhere}`,
        ...params
      );
      
      total = Number(countResult[0].count);

      // Get categories for the foods
      const foodIds = rawFoods.map(f => f.id);
      const categories = foodIds.length > 0 ? await prisma.category.findMany({
        where: {
          id: {
            in: rawFoods.map(f => f.categoryId)
          }
        },
        select: {
          id: true,
          name: true
        }
      }) : [];

      // Attach categories to foods
      foods = rawFoods.map(food => ({
        ...food,
        category: categories.find(c => c.id === food.categoryId)
      }));
    } else {
      // No search, use regular Prisma query
      [foods, total] = await Promise.all([
        prisma.foodItem.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          },
          skip,
          take: limitNum,
          orderBy: { name: 'asc' }
        }),
        prisma.foodItem.count({ where })
      ]);
    }

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
