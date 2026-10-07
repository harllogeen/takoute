#!/bin/bash

# ChopNow Frontend Setup Script
# Run this script to create and configure the Angular frontend

echo "🚀 Setting up ChopNow Frontend..."
echo ""

# Check if Angular CLI is installed
if ! command -v ng &> /dev/null
then
    echo "❌ Angular CLI not found. Installing globally..."
    npm install -g @angular/cli
fi

echo "✅ Angular CLI found"
echo ""

# Create Angular project
echo "📦 Creating Angular project..."
ng new frontend --routing --style=scss --standalone --skip-git

cd frontend

echo ""
echo "📦 Installing dependencies..."

# Add Angular Material
ng add @angular/material --skip-confirmation

# Add Angular PWA
ng add @angular/pwa --skip-confirmation

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Install additional dependencies
npm install zod

echo ""
echo "⚙️ Configuring Tailwind CSS..."

# Configure Tailwind
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        accent: '#ff4081',
      }
    },
  },
  plugins: [],
}
EOF

# Update styles.scss
cat > src/styles.scss << 'EOF'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import '@angular/material/prebuilt-themes/indigo-pink.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}
EOF

echo ""
echo "⚙️ Creating environment files..."

# Create environment files
mkdir -p src/environments

cat > src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'ChopNow',
  version: '1.0.0'
};
EOF

cat > src/environments/environment.prod.ts << 'EOF'
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'ChopNow',
  version: '1.0.0'
};
EOF

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. cd frontend"
echo "   2. npm start"
echo "   3. Open http://localhost:4200"
echo ""
echo "🎉 Happy coding!"
