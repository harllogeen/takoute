import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateOrderNumber, getTodayOrderCount } from '../utils/orderNumber';
import { formatOrderForWhatsApp } from '../utils/whatsapp';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { customerName, customerPhone, customerEmail, deliveryAddress, notes, paymentMethod, items, totalAmount } = validatedData;

    const foodIds = items.map((item: any) => item.foodId);
    const foodItems = await prisma.foodItem.findMany({
      where: { id: { in: foodIds } },
      include: { category: true }
    });

    for (const item of items) {
      const foodItem = foodItems.find((f: any) => f.id === item.foodId);
      if (!foodItem) {
        res.status(404).json({ success: false, message: `Food item not found: ${item.foodId}` });
        return;
      }
      if (!foodItem.isAvailable) {
        res.status(400).json({ success: false, message: `${foodItem.name} is currently unavailable` });
        return;
      }
    }

    const orderCount = await getTodayOrderCount(prisma);
    const orderNumber = generateOrderNumber(orderCount);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        deliveryAddress,
        notes: notes || null,
        paymentMethod,
        total: Number(totalAmount),
        orderItems: {
          create: items.map((item: any) => {
            const foodItem = foodItems.find((f: any) => f.id === item.foodId)!;
            return {
              foodItemId: item.foodId,
              foodName: foodItem.name,
              quantity: item.quantity,
              unitPrice: Number(item.price),
              totalPrice: Number(item.price) * item.quantity
            };
          })
        }
      },
      include: {
        orderItems: {
          include: { foodItem: { include: { category: true } } }
        }
      }
    });

    const whatsappUrl = formatOrderForWhatsApp({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      items: order.orderItems.map((item: any) => ({
        name: item.foodName,
        quantity: item.quantity,
        price: Number(item.unitPrice)
      })),
      total: Number(order.total),
      paymentMethod: order.paymentMethod
    });

    res.status(201).json({
      success: true,
      data: { ...order, whatsappUrl },
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        orderItems: { include: { foodItem: { include: { category: true } } } }
      }
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: { orderItems: { include: { foodItem: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status: status as string } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: { include: { foodItem: true } },
          customer: { select: { id: true, name: true, email: true, phone: true } }
        },
        orderBy: { createdAt: 'desc' },
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
          page: Number(page), limit: Number(limit), total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id },
      data: { status: validatedData.status },
      include: { orderItems: { include: { foodItem: true } } }
    });

    res.json({ success: true, data: order, message: 'Order status updated successfully' });
  } catch (error) {
    next(error);
  }
};
