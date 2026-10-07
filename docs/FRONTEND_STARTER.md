# Frontend Starter Guide - Building ChopNow Components

This guide will help you build the ChopNow frontend step-by-step.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
.\frontend-setup.ps1
```

**Mac/Linux:**
```bash
chmod +x frontend-setup.sh
./frontend-setup.sh
```

### Option 2: Manual Setup

```bash
# Create Angular project
ng new frontend --routing --style=scss --standalone

cd frontend

# Add Angular Material
ng add @angular/material

# Add PWA support
ng add @angular/pwa

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Additional dependencies
npm install zod
```

---

## 📁 Project Structure

Create this folder structure in `frontend/src/app/`:

```
src/app/
├── core/                           # Singleton services
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── food.service.ts
│   │   ├── category.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   └── storage.service.ts
│   └── models/
│       ├── user.model.ts
│       ├── food.model.ts
│       ├── category.model.ts
│       ├── order.model.ts
│       └── cart.model.ts
│
├── shared/                         # Reusable components
│   └── components/
│       ├── header/
│       ├── footer/
│       ├── food-card/
│       ├── loading/
│       └── empty-state/
│
├── features/                       # Feature modules
│   ├── home/
│   ├── foods/
│   ├── cart/
│   ├── checkout/
│   ├── order-success/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   └── admin/
│       ├── dashboard/
│       ├── foods/
│       ├── categories/
│       └── orders/
│
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## 🏗 Step 1: Create Models

### `src/app/core/models/user.model.ts`

```typescript
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}
```

### `src/app/core/models/category.model.ts`

```typescript
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

### `src/app/core/models/food.model.ts`

```typescript
import { Category } from './category.model';

export interface Food {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodsResponse {
  foods: Food[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### `src/app/core/models/cart.model.ts`

```typescript
export interface CartItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}
```

### `src/app/core/models/order.model.ts`

```typescript
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  PAY_ON_DELIVERY = 'PAY_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD'
}

export interface OrderItem {
  id: string;
  foodName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryArea: string;
  deliveryState: string;
  landmark?: string;
  notes?: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export interface CreateOrderRequest {
  items: {
    foodItemId: string;
    quantity: number;
  }[];
  deliveryDetails: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryArea: string;
    deliveryState: string;
    landmark?: string;
    notes?: string;
  };
  paymentMethod: PaymentMethod;
}

export interface OrderResponse {
  order: Order;
  whatsappMessage: string;
  whatsappUrl: string;
}
```

---

## 🔧 Step 2: Create Services

### `src/app/core/services/storage.service.ts`

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}
```

### `src/app/core/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = this.storage.getItem<string>('token');
    const user = this.storage.getItem<User>('user');

    if (token && user) {
      this.tokenSubject.next(token);
      this.currentUserSubject.next(user);
    }
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  private setAuth(user: User, token: string): void {
    this.storage.setItem('token', token);
    this.storage.setItem('user', user);
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }
}
```

### `src/app/core/services/cart.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';
import { Food } from '../models/food.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart';
  private readonly DELIVERY_FEE = 1000;

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadCart();
  }

  private loadCart(): void {
    const items = this.storage.getItem<CartItem[]>(this.CART_KEY) || [];
    this.cartItemsSubject.next(items);
  }

  private saveCart(): void {
    this.storage.setItem(this.CART_KEY, this.cartItemsSubject.value);
  }

  addToCart(food: Food, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingIndex = currentItems.findIndex(item => item.foodId === food.id);

    if (existingIndex >= 0) {
      currentItems[existingIndex].quantity += quantity;
    } else {
      currentItems.push({
        foodId: food.id,
        name: food.name,
        price: food.price,
        quantity,
        imageUrl: food.imageUrl
      });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCart();
  }

  updateQuantity(foodId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(foodId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const index = currentItems.findIndex(item => item.foodId === foodId);

    if (index >= 0) {
      currentItems[index].quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.saveCart();
    }
  }

  removeFromCart(foodId: string): void {
    const currentItems = this.cartItemsSubject.value.filter(
      item => item.foodId !== foodId
    );
    this.cartItemsSubject.next(currentItems);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.storage.removeItem(this.CART_KEY);
  }

  getCartSummary(): Observable<CartSummary> {
    return new Observable(observer => {
      this.cartItems$.subscribe(items => {
        const subtotal = items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        const total = subtotal + this.DELIVERY_FEE;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        observer.next({
          items,
          subtotal,
          deliveryFee: this.DELIVERY_FEE,
          total,
          itemCount
        });
      });
    });
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }
}
```

Continue in next message with more services and components...

---

## 📝 Next Files to Create

1. **Food Service** - API calls for foods
2. **Order Service** - Order creation and management
3. **Auth Interceptor** - Add JWT to requests
4. **Auth Guard** - Protect routes
5. **Components** - UI components

Would you like me to continue with these files?
