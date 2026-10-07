import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { Decimal } from '@prisma/client/runtime/library';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'today' } = req.query;

    // Calculate date range based on period
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'today':
      default:
        // Already set to today at midnight
        break;
    }

    // Get orders within the period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        orderItems: true
      }
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const preparingOrders = orders.filter(o => o.status === 'PREPARING').length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

    // Calculate revenue (only from delivered orders)
    const totalRevenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum.add(order.total), new Decimal(0));

    const averageOrderValue = deliveredOrders > 0 
      ? totalRevenue.div(deliveredOrders)
      : new Decimal(0);

    // Get top foods
    const foodStats: { [key: string]: { name: string; count: number; revenue: Decimal } } = {};
    
    orders.forEach(order => {
      if (order.status === 'DELIVERED') {
        order.orderItems.forEach(item => {
          if (!foodStats[item.foodItemId]) {
            foodStats[item.foodItemId] = {
              name: item.foodName,
              count: 0,
              revenue: new Decimal(0)
            };
          }
          foodStats[item.foodItemId].count += item.quantity;
          foodStats[item.foodItemId].revenue = foodStats[item.foodItemId].revenue.add(item.totalPrice);
        });
      }
    });

    const topFoods = Object.values(foodStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(food => ({
        name: food.name,
        orderCount: food.count,
        revenue: food.revenue.toNumber()
      }));

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue.toNumber(),
        averageOrderValue: averageOrderValue.toNumber(),
        topFoods,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
