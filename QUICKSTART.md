# 🚀 Quick Start Guide

Get Takeoute running in 5 minutes!

## Prerequisites Check

```powershell
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

## Step 1: Backend Setup (2 minutes)

```powershell
# Navigate to backend
cd backend

# Install dependencies (this will take a moment)
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start backend server
npm run dev
```

✅ Backend should now be running on **http://localhost:3000**

You should see:
```
🚀 Server running on port 3000
📱 Environment: development
🌐 CORS enabled for: http://localhost:4200
```

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
ng serve --port 4200
```

✅ Frontend should now be running on **http://localhost:4200**

## Step 3: Test the Application

1. **Open your browser** to http://localhost:4200

2. **You should see:**
   - Header with "Takeoute" logo and cart icon
   - Search bar
   - Category filters (All, Rice, Chicken, Soups, etc.)
   - Grid of 20 food items with images and prices

3. **Try these features:**
   - Click category filters to filter foods
   - Search for a food item
   - Click "Add to Cart" on any food item
   - Click the cart icon (🛒) to view your cart
   - Update quantities in cart
   - Click "Proceed to Checkout"
   - Fill in the form and place an order

## 🎯 What You Should See

### Home Page
- Beautiful gradient header
- Search functionality
- Category chips (All, Rice, Chicken, Soups, Drinks, Snacks)
- Food grid with images, prices, and "Add to Cart" buttons

### Cart Page
- List of items with images
- Quantity controls (+ / -)
- Remove button for each item
- Order summary with total
- "Proceed to Checkout" button

### Checkout Page
- Delivery information form
- Payment method selection
- Order summary sidebar
- WhatsApp integration notice

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Stop it
Stop-Process -Id <ProcessId> -Force
```

**Frontend (Port 4200):**
```powershell
# Find process using port 4200
Get-NetTCPConnection -LocalPort 4200

# Stop it
Stop-Process -Id <ProcessId> -Force
```

### CORS Errors

Make sure backend `.env` has:
```
CORS_ORIGIN=http://localhost:4200
```

Then restart the backend server.

### Images Not Loading

The app uses Unsplash images. Make sure you have internet connection.

### Database Issues

Reset the database:
```powershell
cd backend
Remove-Item dev.db  # Delete old database
npm run prisma:migrate
npm run prisma:seed
```

## 📱 Test Order Flow

1. Add items to cart
2. Go to cart
3. Proceed to checkout
4. Fill in form:
   - Name: John Doe
   - Phone: 08012345678
   - Address: 123 Main Street, Lagos
5. Click "Place Order via WhatsApp"
6. WhatsApp should open with order details

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Backend shows no errors in terminal
- ✅ Frontend compiles successfully
- ✅ Food items display with images
- ✅ Categories can be clicked to filter
- ✅ Cart badge updates when adding items
- ✅ Cart page shows items correctly
- ✅ Checkout form validates properly
- ✅ Order creates successfully and opens WhatsApp

## 📚 Next Steps

- Check out [README.md](README.md) for full documentation
- Explore the API at http://localhost:3000/api
- Customize the food items in `backend/src/prisma/seed.ts`
- Modify colors and styles in frontend components
- Add your own WhatsApp business number in backend `.env`

## 🎉 You're Ready!

Your food ordering application is now fully functional. Start exploring and customizing!

Need help? Check the README or create an issue on GitHub.
