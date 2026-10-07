import { z } from 'zod';

// Auth validations
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^0[789][01]\d{8}$/, 'Invalid Nigerian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Category validations
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  isActive: z.boolean().default(true)
});

export const updateCategorySchema = createCategorySchema.partial();

// Food validations
export const createFoodSchema = z.object({
  name: z.string().min(2, 'Food name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  isAvailable: z.boolean().default(true)
});

export const updateFoodSchema = createFoodSchema.partial();

// Order validations
export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^(\+?234|0)[789]\d{9}$/, 'Invalid Nigerian phone number'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  deliveryAddress: z.string().min(10, 'Please provide a detailed address'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['PAY_ON_DELIVERY', 'BANK_TRANSFER']).default('PAY_ON_DELIVERY'),
  items: z.array(z.object({
    foodId: z.string().uuid('Invalid food ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    price: z.number().positive('Price must be greater than 0')
  })).min(1, 'Order must contain at least one item'),
  totalAmount: z.number().positive('Total amount must be greater than 0')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ])
});
