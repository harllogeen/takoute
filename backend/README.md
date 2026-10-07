# ChopNow Backend API

Node.js/Express REST API for the ChopNow food ordering application.

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── config/
│   │   └── database.ts     # Prisma client
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, error handling, etc.
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript types
│   └── server.ts           # App entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chopnow"
JWT_SECRET=your_super_secret_key
WHATSAPP_BUSINESS_NUMBER=2348012345678
CORS_ORIGIN=http://localhost:4200
```

### Database Setup

1. Generate Prisma Client:
```bash
npm run prisma:generate
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Seed the database:
```bash
npm run prisma:seed
```

This creates:
- Admin user: `admin@chopnow.ng` / `Admin123!`
- Test customer: `customer@test.com` / `Customer123!`
- 6 food categories
- 20 food items

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Health Check
- `GET /health` - API health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Foods
- `GET /api/foods` - Get all foods (with filtering)
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create food (admin only)
- `PUT /api/foods/:id` - Update food (admin only)
- `DELETE /api/foods/:id` - Delete food (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my/orders` - Get customer's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (admin/staff only)
- `PATCH /api/orders/:id/status` - Update order status (admin/staff only)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics (admin/staff only)

See [API.md](../docs/API.md) for complete API documentation.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow
1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token
4. Client includes token in Authorization header: `Bearer <token>`

### Protected Routes
Most routes require authentication. Include the JWT token in the request header:

```
Authorization: Bearer your_jwt_token_here
```

### Roles
- **CUSTOMER**: Can browse foods, create orders, view own orders
- **STAFF**: Can view and update orders
- **ADMIN**: Full access to all resources

## 🗃 Database

### Schema
The database uses PostgreSQL with the following main tables:
- `users` - Customer and admin accounts
- `categories` - Food categories
- `food_items` - Menu items
- `orders` - Customer orders
- `order_items` - Items in each order

### Prisma Commands

```bash
# Open Prisma Studio (GUI)
npm run prisma:studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Deploy migrations (production)
npx prisma migrate deploy
```

## 📲 WhatsApp Integration

When an order is created, the API generates:
1. A formatted WhatsApp message with order details
2. A WhatsApp click-to-chat URL

The message includes:
- Order number
- Items with quantities and prices
- Customer details
- Delivery address
- Total amount

Example URL format:
```
https://wa.me/2348012345678?text=<encoded_message>
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
  - General: 100 requests per 15 minutes
  - Auth: 5 attempts per 15 minutes
  - Orders: 10 orders per hour
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: Zod schemas
- **SQL Injection Protection**: Prisma parameterized queries

## 🧪 Testing

### Manual Testing

Use the seeded data:

**Admin Login:**
```json
POST /api/auth/login
{
  "email": "admin@chopnow.ng",
  "password": "Admin123!"
}
```

**Customer Login:**
```json
POST /api/auth/login
{
  "email": "customer@test.com",
  "password": "Customer123!"
}
```

### Tools
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## 📦 Deployment

### Environment Variables

Production `.env`:
```env
NODE_ENV=production
DATABASE_URL="your_production_database_url"
JWT_SECRET="your_secure_production_secret"
WHATSAPP_BUSINESS_NUMBER="your_whatsapp_number"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Deployment Platforms

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

**Render:**
1. Connect GitHub repository
2. Set environment variables
3. Add build command: `npm run build`
4. Add start command: `npm start`

**Heroku:**
```bash
heroku create chopnow-api
heroku addons:create heroku-postgresql
git push heroku main
```

### Database Migration (Production)
```bash
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Check Prisma Client
npm run prisma:generate
```

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3001
```

### Migration Errors
```bash
# Reset and re-migrate (development only)
npx prisma migrate reset
npm run prisma:migrate
```

## 📝 Scripts

```json
{
  "dev": "Start development server with auto-reload",
  "build": "Compile TypeScript to JavaScript",
  "start": "Run production server",
  "prisma:generate": "Generate Prisma Client",
  "prisma:migrate": "Run database migrations",
  "prisma:studio": "Open Prisma Studio GUI",
  "prisma:seed": "Seed database with sample data"
}
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT

---

Built with ❤️ for ChopNow
