# Database Schema Documentation

## Overview

ChopNow uses PostgreSQL with Prisma ORM for type-safe database access.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    users    │         │    orders    │         │ order_items │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │◄───────┤│ customerId   │         │ id          │
│ name        │         │ orderNumber  │◄───────┤│ orderId     │
│ email       │         │ subtotal     │         │ foodItemId  │
│ phone       │         │ deliveryFee  │         │ quantity    │
│ password    │         │ total        │         │ unitPrice   │
│ role        │         │ status       │         │ totalPrice  │
└─────────────┘         │ ...          │         └─────────────┘
                        └──────────────┘                │
                                                        │
┌──────────────┐       ┌──────────────┐                │
│  categories  │       │  food_items  │◄───────────────┘
├──────────────┤       ├──────────────┤
│ id           │◄─────┤│ categoryId   │
│ name         │       │ name         │
│ description  │       │ description  │
│ imageUrl     │       │ price        │
│ isActive     │       │ imageUrl     │
└──────────────┘       │ isAvailable  │
                       └──────────────┘
```

## Tables

### users

Stores customer and admin accounts.

| Column    | Type      | Constraints                    | Description                      |
|-----------|-----------|--------------------------------|----------------------------------|
| id        | UUID      | PRIMARY KEY, DEFAULT uuid()    | Unique user identifier           |
| name      | VARCHAR   | NOT NULL                       | Full name                        |
| email     | VARCHAR   | UNIQUE, NOT NULL               | Email address                    |
| phone     | VARCHAR   | UNIQUE, NOT NULL               | Phone number                     |
| password  | VARCHAR   | NOT NULL                       | Hashed password                  |
| role      | ENUM      | DEFAULT 'CUSTOMER'             | CUSTOMER, ADMIN, STAFF           |
| createdAt | TIMESTAMP | DEFAULT NOW()                  | Account creation date            |
| updatedAt | TIMESTAMP | DEFAULT NOW()                  | Last update                      |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_phone` on `phone`
- `idx_users_role` on `role`

### categories

Food categories (Rice, Chicken, Drinks, etc.).

| Column      | Type      | Constraints                 | Description                    |
|-------------|-----------|----------------------------|--------------------------------|
| id          | UUID      | PRIMARY KEY, DEFAULT uuid()| Unique category identifier     |
| name        | VARCHAR   | UNIQUE, NOT NULL           | Category name                  |
| description | TEXT      | NULL                       | Category description           |
| imageUrl    | VARCHAR   | NULL                       | Category image                 |
| isActive    | BOOLEAN   | DEFAULT true               | Is category visible            |
| createdAt   | TIMESTAMP | DEFAULT NOW()              | Creation date                  |
| updatedAt   | TIMESTAMP | DEFAULT NOW()              | Last update                    |

**Indexes:**
- `idx_categories_name` on `name`
- `idx_categories_active` on `isActive`

### food_items

Individual menu items.

| Column      | Type      | Constraints                     | Description                  |
|-------------|-----------|--------------------------------|------------------------------|
| id          | UUID      | PRIMARY KEY, DEFAULT uuid()    | Unique food identifier       |
| name        | VARCHAR   | NOT NULL                       | Food name                    |
| description | TEXT      | NULL                           | Food description             |
| price       | DECIMAL   | NOT NULL, CHECK (price >= 0)   | Price in Naira               |
| imageUrl    | VARCHAR   | NULL                           | Food image URL               |
| categoryId  | UUID      | FOREIGN KEY → categories(id)   | Category reference           |
| isAvailable | BOOLEAN   | DEFAULT true                   | Is food currently available  |
| createdAt   | TIMESTAMP | DEFAULT NOW()                  | Creation date                |
| updatedAt   | TIMESTAMP | DEFAULT NOW()                  | Last update                  |

**Indexes:**
- `idx_food_category` on `categoryId`
- `idx_food_available` on `isAvailable`
- `idx_food_name` on `name`

**Constraints:**
- `ON DELETE CASCADE` for category deletion

### orders

Customer orders.

| Column          | Type      | Constraints                     | Description                        |
|-----------------|-----------|--------------------------------|------------------------------------|
| id              | UUID      | PRIMARY KEY, DEFAULT uuid()    | Unique order identifier            |
| orderNumber     | VARCHAR   | UNIQUE, NOT NULL               | Human-readable order number        |
| customerId      | UUID      | FOREIGN KEY → users(id)        | Customer reference                 |
| customerName    | VARCHAR   | NOT NULL                       | Customer name (snapshot)           |
| customerPhone   | VARCHAR   | NOT NULL                       | Customer phone (snapshot)          |
| subtotal        | DECIMAL   | NOT NULL                       | Sum of all items                   |
| deliveryFee     | DECIMAL   | NOT NULL                       | Delivery charge                    |
| total           | DECIMAL   | NOT NULL                       | Subtotal + delivery                |
| status          | ENUM      | DEFAULT 'PENDING'              | Order status                       |
| paymentMethod   | ENUM      | DEFAULT 'PAY_ON_DELIVERY'      | Payment method                     |
| paymentStatus   | ENUM      | DEFAULT 'PENDING'              | Payment status                     |
| deliveryAddress | TEXT      | NOT NULL                       | Full delivery address              |
| deliveryArea    | VARCHAR   | NOT NULL                       | Area/neighborhood                  |
| deliveryState   | VARCHAR   | NOT NULL                       | State                              |
| landmark        | VARCHAR   | NULL                           | Landmark for easier location       |
| notes           | TEXT      | NULL                           | Customer notes                     |
| whatsappSent    | BOOLEAN   | DEFAULT false                  | WhatsApp message sent flag         |
| createdAt       | TIMESTAMP | DEFAULT NOW()                  | Order creation date                |
| updatedAt       | TIMESTAMP | DEFAULT NOW()                  | Last update                        |

**Indexes:**
- `idx_orders_customer` on `customerId`
- `idx_orders_status` on `status`
- `idx_orders_number` on `orderNumber`
- `idx_orders_created` on `createdAt DESC`

**Order Status ENUM:**
- `PENDING`
- `CONFIRMED`
- `PREPARING`
- `READY`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

**Payment Method ENUM:**
- `PAY_ON_DELIVERY`
- `BANK_TRANSFER`
- `CARD` (future)

**Payment Status ENUM:**
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

### order_items

Items within each order (preserves price at time of ordering).

| Column     | Type      | Constraints                     | Description                      |
|------------|-----------|--------------------------------|----------------------------------|
| id         | UUID      | PRIMARY KEY, DEFAULT uuid()    | Unique item identifier           |
| orderId    | UUID      | FOREIGN KEY → orders(id)       | Order reference                  |
| foodItemId | UUID      | FOREIGN KEY → food_items(id)   | Food reference                   |
| foodName   | VARCHAR   | NOT NULL                       | Food name (snapshot)             |
| quantity   | INTEGER   | NOT NULL, CHECK (quantity > 0) | Quantity ordered                 |
| unitPrice  | DECIMAL   | NOT NULL                       | Price per unit at order time     |
| totalPrice | DECIMAL   | NOT NULL                       | unitPrice × quantity             |
| createdAt  | TIMESTAMP | DEFAULT NOW()                  | Creation date                    |

**Indexes:**
- `idx_order_items_order` on `orderId`
- `idx_order_items_food` on `foodItemId`

**Constraints:**
- `ON DELETE CASCADE` for order deletion

## Sample Data

### Categories

```sql
INSERT INTO categories (name, description, isActive) VALUES
('Rice', 'All rice dishes', true),
('Chicken', 'Grilled and fried chicken', true),
('Swallow', 'Eba, Fufu, Pounded Yam', true),
('Soups', 'Nigerian soups', true),
('Drinks', 'Soft drinks and beverages', true),
('Snacks', 'Small chops and snacks', true);
```

### Food Items

```sql
INSERT INTO food_items (name, description, price, categoryId, isAvailable) VALUES
('Jollof Rice & Chicken', 'Delicious Nigerian jollof rice with grilled chicken', 4500, 'rice-category-id', true),
('Fried Rice', 'Colorful fried rice with vegetables', 3500, 'rice-category-id', true),
('Grilled Chicken (Full)', 'Whole grilled chicken', 6000, 'chicken-category-id', true),
('Coca Cola', 'Chilled Coca Cola', 500, 'drinks-category-id', true);
```

## Database Queries

### Get Available Foods by Category

```sql
SELECT f.*, c.name as category_name
FROM food_items f
JOIN categories c ON f.categoryId = c.id
WHERE f.isAvailable = true
  AND c.isActive = true
  AND c.id = $1
ORDER BY f.name;
```

### Get Order with Items

```sql
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'foodName', oi.foodName,
      'quantity', oi.quantity,
      'unitPrice', oi.unitPrice,
      'totalPrice', oi.totalPrice
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.orderId
WHERE o.id = $1
GROUP BY o.id;
```

### Get Today's Orders Summary

```sql
SELECT 
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'PENDING') as pending,
  COUNT(*) FILTER (WHERE status = 'DELIVERED') as delivered,
  SUM(total) as revenue
FROM orders
WHERE DATE(createdAt) = CURRENT_DATE;
```

## Prisma Schema

See `backend/src/prisma/schema.prisma` for the complete Prisma schema definition.

## Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns are indexed
2. **Cascading Deletes**: Set up for referential integrity
3. **Price Snapshots**: Store prices in order_items to preserve historical data
4. **Connection Pooling**: Use Prisma's built-in connection pooling
5. **Pagination**: Implement cursor-based pagination for large datasets

## Security

1. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
2. **SQL Injection**: Prisma automatically parameterizes queries
3. **Role-Based Access**: Enforce at application level
4. **Data Validation**: Validate all inputs before database operations
5. **Soft Deletes**: Consider adding `deletedAt` for critical tables

## Backup Strategy

1. Daily automated backups
2. Point-in-time recovery enabled
3. Test restoration procedures regularly
4. Store backups in different geographic location

---

**Last Updated**: October 2026  
**Schema Version**: 1.0.0
