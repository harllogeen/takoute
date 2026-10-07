# 🍽️ Takeoute - Food Ordering PWA

A complete Progressive Web Application for ordering Nigerian food online with WhatsApp integration.

![Takeoute](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Angular](https://img.shields.io/badge/Angular-14-red)
![Node.js](https://img.shields.io/badge/Node.js-24-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue)

## 🚀 Features

### Customer Features
- 📱 **Browse Menu** - View all available food items with images and descriptions
- 🔍 **Search & Filter** - Search for food items and filter by categories
- 🛒 **Shopping Cart** - Add items to cart with quantity management
- 💳 **Multiple Payment Options** - Pay on delivery or bank transfer
- 📲 **WhatsApp Integration** - Receive order confirmation via WhatsApp
- 📦 **Order Tracking** - Track your order status
- 🎨 **Beautiful UI** - Modern, responsive design that works on all devices

### Technical Features
- ✅ **RESTful API** - Clean, documented REST API
- 🔐 **Authentication** - JWT-based authentication system
- 🗃️ **Database** - SQLite database with Prisma ORM
- 🎯 **TypeScript** - Full TypeScript implementation
- 📝 **Data Validation** - Comprehensive input validation
- 🚦 **Rate Limiting** - API rate limiting for security
- 🔒 **Security** - Helmet.js, CORS, input sanitization

## 🏗️ Tech Stack

### Frontend
- **Framework**: Angular 14
- **Language**: TypeScript 4.7
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: RxJS

### Backend
- **Runtime**: Node.js 24
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

```
Takeoute/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── prisma/         # Database seed
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Express app setup
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Angular components
│   │   │   ├── models/     # TypeScript interfaces
│   │   │   ├── services/   # API services
│   │   │   └── app.module.ts
│   │   ├── environments/   # Environment configs
│   │   └── styles.scss     # Global styles
│   └── package.json
└── docs/                   # Documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Takeoute
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment file
copy .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will run on: http://localhost:3000

3. **Frontend Setup**
```bash
cd frontend
npm install

# Start frontend server
ng serve --port 4200
```

Frontend will run on: http://localhost:4200

## 🗄️ Database

The app uses SQLite database with the following main entities:

- **Users** - Customer and admin accounts
- **Categories** - Food categories (Rice, Chicken, Soups, etc.)
- **FoodItems** - Menu items with prices and images
- **Orders** - Customer orders
- **OrderItems** - Individual items in orders

### Default Accounts

After seeding the database:

**Admin Account**
- Email: `admin@chopnow.ng`
- Password: `Admin123!`

**Test Customer**
- Email: `customer@test.com`
- Password: `Customer123!`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Foods
- `GET /api/foods` - Get all food items
- `GET /api/foods/:id` - Get food by ID
- Query params: `categoryId`, `search`

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order by number

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `PATCH /api/admin/orders/:id/status` - Update order status

## 🎨 UI Components

### Pages
1. **Home** - Browse food menu with categories and search
2. **Cart** - View and manage cart items
3. **Checkout** - Complete order with delivery details

### Components
- **Header** - Navigation with cart badge
- **Food Card** - Display food item with image and details
- **Cart Item** - Shopping cart item with quantity controls
- **Category Filter** - Filter foods by category

## 💳 Payment Methods

- **Pay on Delivery** (Default)
- **Bank Transfer**

## 📱 WhatsApp Integration

Orders are automatically sent to WhatsApp with:
- Order number
- Customer details
- Order items with quantities
- Total amount
- Delivery address

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication
- CORS protection
- Helmet.js security headers
- Rate limiting
- Input validation and sanitization

## 🌐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
WHATSAPP_BUSINESS_NUMBER=2348012345678
CORS_ORIGIN=http://localhost:4200
```

### Frontend (environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'Takeoute',
  version: '1.0.0'
};
```

## 📊 Features Roadmap

- [ ] PWA manifest and service worker
- [ ] User authentication in frontend
- [ ] Order history page
- [ ] Real-time order tracking
- [ ] Admin dashboard
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Push notifications
- [ ] Review and ratings system
- [ ] Favorites/Wishlist

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@takeoute.com

## 🙏 Acknowledgments

- Food images from Unsplash
- Icons from emoji library
- Inspired by modern food delivery apps

---

Built with ❤️ using Angular and Node.js
