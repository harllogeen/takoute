# API Documentation

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Flow

1. Register or login to receive JWT token
2. Include token in subsequent requests
3. Token expires after 7 days
4. Refresh token or re-login when expired

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08012345678",
      "role": "CUSTOMER"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "role": "CUSTOMER"
  }
}
```

---

## Categories

### Get All Categories

```http
GET /api/categories
```

**Query Parameters:**
- `active` (optional): `true` to get only active categories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Rice",
      "description": "All rice dishes",
      "imageUrl": "https://...",
      "isActive": true,
      "createdAt": "2026-10-06T10:00:00Z"
    }
  ]
}
```

### Get Category by ID

```http
GET /api/categories/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Rice",
    "description": "All rice dishes",
    "imageUrl": "https://...",
    "isActive": true,
    "foodCount": 12
  }
}
```

### Create Category (Admin Only)

```http
POST /api/categories
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "name": "Breakfast",
  "description": "Morning meals",
  "imageUrl": "https://...",
  "isActive": true
}
```

### Update Category (Admin Only)

```http
PUT /api/categories/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": false
}
```

### Delete Category (Admin Only)

```http
DELETE /api/categories/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

---

## Food Items

### Get All Foods

```http
GET /api/foods
```

**Query Parameters:**
- `category` (optional): Filter by category ID
- `available` (optional): `true` for available items only
- `search` (optional): Search in name and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "id": "uuid",
        "name": "Jollof Rice & Chicken",
        "description": "Delicious Nigerian jollof...",
        "price": 4500,
        "imageUrl": "https://...",
        "category": {
          "id": "uuid",
          "name": "Rice"
        },
        "isAvailable": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### Get Food by ID

```http
GET /api/foods/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jollof Rice & Chicken",
    "description": "Delicious Nigerian jollof rice with grilled chicken",
    "price": 4500,
    "imageUrl": "https://...",
    "category": {
      "id": "uuid",
      "name": "Rice"
    },
    "isAvailable": true,
    "createdAt": "2026-10-01T10:00:00Z",
    "updatedAt": "2026-10-06T10:00:00Z"
  }
}
```

### Create Food Item (Admin Only)

```http
POST /api/foods
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "name": "Fried Rice",
  "description": "Colorful fried rice with vegetables",
  "price": 3500,
  "imageUrl": "https://...",
  "categoryId": "uuid",
  "isAvailable": true
}
```

### Update Food Item (Admin Only)

```http
PUT /api/foods/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "name": "Updated Name",
  "price": 4000,
  "isAvailable": false
}
```

### Delete Food Item (Admin Only)

```http
DELETE /api/foods/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

---

## Orders

### Create Order

```http
POST /api/orders
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "items": [
    {
      "foodItemId": "uuid",
      "quantity": 2
    },
    {
      "foodItemId": "uuid",
      "quantity": 1
    }
  ],
  "deliveryDetails": {
    "customerName": "John Doe",
    "customerPhone": "08012345678",
    "deliveryAddress": "12 Example Street",
    "deliveryArea": "Gwarinpa",
    "deliveryState": "Abuja",
    "landmark": "Near XYZ Junction",
    "notes": "Please call on arrival"
  },
  "paymentMethod": "PAY_ON_DELIVERY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-20261006-001",
      "subtotal": 11000,
      "deliveryFee": 1000,
      "total": 12000,
      "status": "PENDING",
      "items": [
        {
          "foodName": "Jollof Rice & Chicken",
          "quantity": 2,
          "unitPrice": 4500,
          "totalPrice": 9000
        }
      ]
    },
    "whatsappMessage": "Hello ChopNow...",
    "whatsappUrl": "https://wa.me/2348012345678?text=..."
  }
}
```

### Get Order by ID

```http
GET /api/orders/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20261006-001",
    "customerName": "John Doe",
    "customerPhone": "08012345678",
    "subtotal": 11000,
    "deliveryFee": 1000,
    "total": 12000,
    "status": "CONFIRMED",
    "paymentMethod": "PAY_ON_DELIVERY",
    "paymentStatus": "PENDING",
    "deliveryAddress": "12 Example Street",
    "deliveryArea": "Gwarinpa",
    "deliveryState": "Abuja",
    "landmark": "Near XYZ Junction",
    "items": [
      {
        "foodName": "Jollof Rice & Chicken",
        "quantity": 2,
        "unitPrice": 4500,
        "totalPrice": 9000
      }
    ],
    "createdAt": "2026-10-06T10:00:00Z"
  }
}
```

### Get My Orders

```http
GET /api/orders/my/orders
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20261006-001",
        "total": 12000,
        "status": "DELIVERED",
        "createdAt": "2026-10-06T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Get All Orders (Admin Only)

```http
GET /api/orders
```

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page
- `from` (optional): Date from (ISO 8601)
- `to` (optional): Date to (ISO 8601)

### Update Order Status (Admin/Staff Only)

```http
PATCH /api/orders/:id/status
```

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valid Status Transitions:**
- `PENDING` → `CONFIRMED` or `CANCELLED`
- `CONFIRMED` → `PREPARING` or `CANCELLED`
- `PREPARING` → `READY` or `CANCELLED`
- `READY` → `OUT_FOR_DELIVERY`
- `OUT_FOR_DELIVERY` → `DELIVERED`

---

## Dashboard (Admin Only)

### Get Dashboard Stats

```http
GET /api/admin/dashboard/stats
```

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `period` (optional): `today`, `week`, `month`, `year` (default: `today`)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 45,
    "pendingOrders": 7,
    "preparingOrders": 5,
    "deliveredOrders": 30,
    "cancelledOrders": 3,
    "totalRevenue": 540000,
    "averageOrderValue": 12000,
    "topFoods": [
      {
        "name": "Jollof Rice & Chicken",
        "orderCount": 89,
        "revenue": 400500
      }
    ],
    "recentOrders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20261006-001",
        "customerName": "John Doe",
        "total": 12000,
        "status": "PENDING",
        "createdAt": "2026-10-06T10:00:00Z"
      }
    ]
  }
}
```

---

## Delivery

### Get Delivery Settings (Admin Only)

```http
GET /api/delivery/settings
```

### Update Delivery Fee (Admin Only)

```http
PUT /api/delivery/fee
```

**Body:**
```json
{
  "defaultFee": 1000,
  "areaFees": [
    { "area": "Gwarinpa", "fee": 1000 },
    { "area": "Wuse", "fee": 1500 },
    { "area": "Maitama", "fee": 2000 }
  ]
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- **General**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Order creation**: 10 requests per hour

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_001` | Invalid credentials | Wrong email/password |
| `AUTH_002` | Token expired | JWT token has expired |
| `AUTH_003` | Unauthorized | No valid token provided |
| `VAL_001` | Validation error | Input validation failed |
| `ORD_001` | Food not available | Requested food is unavailable |
| `ORD_002` | Invalid quantity | Quantity must be > 0 |
| `ORD_003` | Order not found | Order ID doesn't exist |

---

## Webhooks (Future)

For WhatsApp Business Platform integration, webhooks will be available at:

```http
POST /api/webhooks/whatsapp
```

This will receive order status updates and customer messages.

---

## Testing

Use the following test credentials:

**Admin:**
- Email: `admin@chopnow.ng`
- Password: `Admin123!`

**Customer:**
- Email: `customer@test.com`
- Password: `Customer123!`

---

**API Version**: 1.0.0  
**Last Updated**: October 2026
