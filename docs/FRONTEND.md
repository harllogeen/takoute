# Frontend Architecture - ChopNow Angular PWA

## Overview

The ChopNow frontend is a Progressive Web Application built with Angular 18+, featuring standalone components, reactive forms, and PWA capabilities.

## Technology Stack

- **Framework**: Angular 18+ (Standalone Components)
- **Language**: TypeScript 5.6+
- **Styling**: Tailwind CSS + Angular Material
- **State Management**: RxJS + Services
- **HTTP**: Angular HttpClient
- **Forms**: Reactive Forms
- **PWA**: Angular Service Worker
- **Build**: Angular CLI with Webpack

## Project Structure

```
frontend/src/
├── app/
│   ├── core/                          # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   │   ├── auth.guard.ts         # Protect routes requiring authentication
│   │   │   └── admin.guard.ts        # Protect admin routes
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts   # Add JWT to requests
│   │   │   ├── error.interceptor.ts  # Global error handling
│   │   │   └── loading.interceptor.ts # Show loading state
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Authentication & user management
│   │   │   ├── food.service.ts       # Food item operations
│   │   │   ├── category.service.ts   # Category operations
│   │   │   ├── order.service.ts      # Order operations
│   │   │   ├── cart.service.ts       # Shopping cart management
│   │   │   └── storage.service.ts    # LocalStorage wrapper
│   │   └── models/
│   │       ├── user.model.ts         # User interfaces
│   │       ├── food.model.ts         # Food interfaces
│   │       ├── order.model.ts        # Order interfaces
│   │       └── cart.model.ts         # Cart interfaces
│   │
│   ├── shared/                        # Reusable components, pipes, directives
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.scss
│   │   │   ├── footer/
│   │   │   ├── food-card/            # Food item card
│   │   │   ├── cart-button/          # Floating cart button
│   │   │   ├── loading-spinner/      # Loading indicator
│   │   │   └── empty-state/          # Empty state component
│   │   ├── pipes/
│   │   │   ├── currency-ngn.pipe.ts  # Format Naira currency
│   │   │   └── truncate.pipe.ts      # Truncate text
│   │   └── directives/
│   │
│   ├── features/                      # Feature modules
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.scss
│   │   ├── foods/
│   │   │   ├── food-list/
│   │   │   └── food-detail/
│   │   ├── cart/
│   │   │   ├── cart.component.ts
│   │   │   ├── cart.component.html
│   │   │   └── cart.component.scss
│   │   ├── checkout/
│   │   │   ├── checkout.component.ts
│   │   │   ├── checkout.component.html
│   │   │   └── checkout.component.scss
│   │   ├── order-success/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── foods/
│   │       ├── categories/
│   │       └── orders/
│   │
│   ├── app.component.ts               # Root component
│   ├── app.config.ts                  # App configuration
│   └── app.routes.ts                  # Routing configuration
│
├── assets/
│   ├── icons/                         # PWA icons
│   ├── images/                        # App images
│   └── fonts/                         # Custom fonts (optional)
│
├── environments/
│   ├── environment.ts                 # Development config
│   └── environment.prod.ts            # Production config
│
├── manifest.webmanifest               # PWA manifest
├── ngsw-config.json                   # Service worker config
├── index.html
├── main.ts
└── styles.scss                        # Global styles
```

## Core Concepts

### 1. Standalone Components

All components use Angular's standalone API:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent {
  // Component logic
}
```

### 2. Services & Dependency Injection

Services are provided in root by default:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  constructor(private http: HttpClient) {}
  
  // Service methods
}
```

### 3. Reactive Forms

Use Reactive Forms for all form handling:

```typescript
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export class CheckoutComponent {
  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^0[789][01]\d{8}$/)]],
    address: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}
}
```

### 4. RxJS for State Management

Use BehaviorSubjects for reactive state:

```typescript
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  
  getCart(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }
  
  addToCart(item: CartItem): void {
    const current = this.cartItems$.value;
    this.cartItems$.next([...current, item]);
  }
}
```

## Key Features

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌─────────┐
│  Login   │────▶│   Auth   │────▶│  Store  │
│Component │     │ Service  │     │  Token  │
└──────────┘     └──────────┘     └─────────┘
                       │
                       ▼
                 ┌──────────────┐
                 │ Interceptor  │
                 │ Adds Token   │
                 │ to Requests  │
                 └──────────────┘
```

### Cart Management

```typescript
// cart.service.ts
export interface CartItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);
  
  addItem(food: FoodItem): void {
    const current = this.items$.value;
    const existing = current.find(item => item.foodId === food.id);
    
    if (existing) {
      existing.quantity++;
      this.items$.next([...current]);
    } else {
      this.items$.next([...current, {
        foodId: food.id,
        name: food.name,
        price: food.price,
        quantity: 1,
        imageUrl: food.imageUrl
      }]);
    }
    
    this.saveToStorage();
  }
  
  private saveToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.items$.value));
  }
}
```

### Order Flow

```
Browse ──▶ Add to Cart ──▶ Cart ──▶ Checkout ──▶ Order Summary ──▶ WhatsApp
```

### WhatsApp Integration

```typescript
// order.service.ts
openWhatsApp(order: Order): void {
  const message = this.generateOrderMessage(order);
  const phoneNumber = environment.whatsappBusinessNumber;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

private generateOrderMessage(order: Order): string {
  return `
Hello ChopNow,
Order: ${order.orderNumber}
Total: ₦${order.total}
...
  `.trim();
}
```

## Routing Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'foods', component: FoodListComponent },
  { path: 'foods/:id', component: FoodDetailComponent },
  { path: 'cart', component: CartComponent },
  { 
    path: 'checkout', 
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'order-success/:id', 
    component: OrderSuccessComponent 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'foods', component: AdminFoodsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'orders', component: AdminOrdersComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
```

## PWA Configuration

### Service Worker Strategy

```json
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-foods",
      "urls": ["/api/foods", "/api/categories"],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1h",
        "strategy": "performance"
      }
    }
  ]
}
```

### Offline Strategy

```typescript
// app.component.ts
export class AppComponent implements OnInit {
  isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
  
  ngOnInit(): void {
    window.addEventListener('online', () => this.isOnline$.next(true));
    window.addEventListener('offline', () => this.isOnline$.next(false));
  }
}
```

## Styling Guidelines

### Tailwind Utilities

```html
<!-- Card component -->
<div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
  <img class="w-full h-48 object-cover rounded-md" [src]="food.imageUrl">
  <h3 class="text-lg font-semibold mt-2">{{ food.name }}</h3>
  <p class="text-gray-600 text-sm">{{ food.description }}</p>
  <p class="text-lg font-bold mt-2">₦{{ food.price | number }}</p>
</div>
```

### Responsive Design

```html
<!-- Mobile-first approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <app-food-card *ngFor="let food of foods" [food]="food" />
</div>
```

## Performance Optimization

1. **Lazy Loading**: Load feature modules on demand
2. **OnPush Change Detection**: For performance-critical components
3. **TrackBy Functions**: For ngFor loops
4. **Image Optimization**: Use WebP format, lazy loading
5. **Bundle Optimization**: Tree-shaking, code splitting

```typescript
@Component({
  selector: 'app-food-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListComponent {
  trackByFoodId(index: number, food: FoodItem): string {
    return food.id;
  }
}
```

## Testing Strategy

### Unit Tests
- Components: Test rendering and user interactions
- Services: Test HTTP calls and business logic
- Guards: Test route protection
- Pipes: Test data transformation

### E2E Tests (Optional)
- Critical user flows
- Order creation process
- Admin operations

## Build & Deployment

### Development Build
```bash
ng serve
```

### Production Build
```bash
ng build --configuration production
```

### PWA Build (Test Locally)
```bash
ng build --configuration production
npx http-server -p 4200 -c-1 dist/frontend/browser
```

## Best Practices

1. **Component Size**: Keep components small and focused
2. **Smart vs Dumb**: Use container/presentational pattern
3. **Type Safety**: Use TypeScript strictly
4. **Observables**: Always unsubscribe (use async pipe or takeUntil)
5. **Error Handling**: Graceful error states
6. **Accessibility**: ARIA labels, semantic HTML
7. **Security**: Sanitize user input, use HttpOnly cookies for tokens

## Common Patterns

### HTTP Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class FoodService {
  private apiUrl = `${environment.apiUrl}/foods`;
  
  getFoods(params?: any): Observable<ApiResponse<Food[]>> {
    return this.http.get<ApiResponse<Food[]>>(this.apiUrl, { params });
  }
  
  getFoodById(id: string): Observable<ApiResponse<Food>> {
    return this.http.get<ApiResponse<Food>>(`${this.apiUrl}/${id}`);
  }
}
```

### Error Handling Pattern
```typescript
this.foodService.getFoods()
  .pipe(
    catchError(error => {
      this.errorMessage = 'Failed to load foods';
      return of({ success: false, data: [] });
    })
  )
  .subscribe(response => {
    if (response.success) {
      this.foods = response.data;
    }
  });
```

---

**Last Updated**: October 2026  
**Angular Version**: 18.x  
**TypeScript Version**: 5.6.x
