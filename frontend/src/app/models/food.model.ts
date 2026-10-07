export interface Food {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface Order {
  id?: string;
  orderNumber?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
}

export interface OrderItem {
  foodId: string;
  quantity: number;
  price: number;
  food?: Food;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
