import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateOrderNumber, getTodayOrderCount } from '../utils/orderNumber';
import { formatOrderForWhatsApp } from '../utils/whatsapp';
import { Decimal } from '@prisma/client/runtime/library';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { 
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      notes,
      paymentMethod,
      items,
      totalAmount
    } = validatedData;

    // Fetch food items to validate they exist
    const foodIds = items.map(item => item.foodId);
    const foodItems = await prisma.foodItem.findMany({
      where: {
        id: { in: foodIds }
      },
      include: {
        category: true
      }
    });

    // Validate all items exist and are available
    for (const item of items) {
      const foodItem = foodItems.find(f => f.id === item.foodId);
      if (!foodItem) {
        return res.status(404).json({
          success: false,
          message: `Food item not found: ${item.foodId}`
        });
      }
      if (!foodItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${foodItem.name} is currently unavailable`
        });
      }
    }

    // Generate order number
    const orderCount = await getTodayOrderCount(prisma);
    const orderNumber = generateOrderNumber(orderCount);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        deliveryAddress,
        notes: notes || null,
        paymentMethod,
        total: new Decimal(totalAmount),
        orderItems: {
          create: items.map(item => {
            const foodItem = foodItems.find(f => f.id === item.foodId)!;
            return {
              foodItemId: item.foodId,
              foodName: foodItem.name,
              quantity: item.quantity,
              unitPrice: new Decimal(item.price),
              totalPrice: new Decimal(item.price).mul(item.quantity)
            };
          })
        }
      },
      include: {
        orderItems: {
          include: {
            foodItem: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    // Generate WhatsApp message
    const whatsappUrl = formatOrderForWhatsApp({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      items: order.orderItems.map(item => ({
        name: item.foodName,
        quantity: item.quantity,
        price: parseFloat(item.unitPrice.toString())
      })),
      total: parseFloat(order.total.toString()),
      paymentMethod: order.paymentMethod
    });

    res.status(201).json({
      success: true,
      data: {
        ...order,
        whatsappUrl
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id }
        ]
      },
      include: {
        orderItems: {
          include: {
            foodItem: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: req.user.id
      },
      include: {
        orderItems: {
          include: {
            foodItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = status ? { status: status as string } : {};
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              foodItem: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: validatedData.status
      },
      include: {
        orderItems: {
          include: {
            foodItem: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
