# ChopNow Frontend Setup Script (PowerShell)
# Run this script to create and configure the Angular frontend

Write-Host "🚀 Setting up ChopNow Frontend..." -ForegroundColor Green
Write-Host ""

# Check if Angular CLI is installed
$ngVersion = ng version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Angular CLI not found. Installing globally..." -ForegroundColor Red
    npm install -g @angular/cli
}

Write-Host "✅ Angular CLI found" -ForegroundColor Green
Write-Host ""

# Create Angular project
Write-Host "📦 Creating Angular project..." -ForegroundColor Cyan
ng new frontend --routing --style=scss --standalone --skip-git

Set-Location frontend

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

# Add Angular Material
ng add @angular/material --skip-confirmation

# Add Angular PWA
ng add @angular/pwa --skip-confirmation

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Install additional dependencies
npm install zod

Write-Host ""
Write-Host "⚙️ Configuring Tailwind CSS..." -ForegroundColor Cyan

# Configure Tailwind
@"
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
"@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# Update styles.scss
@"
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
"@ | Out-File -FilePath "src/styles.scss" -Encoding utf8

Write-Host ""
Write-Host "⚙️ Creating environment files..." -ForegroundColor Cyan

# Create environment files
New-Item -ItemType Directory -Force -Path "src/environments" | Out-Null

@"
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'ChopNow',
  version: '1.0.0'
};
"@ | Out-File -FilePath "src/environments/environment.ts" -Encoding utf8

@"
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'ChopNow',
  version: '1.0.0'
};
"@ | Out-File -FilePath "src/environments/environment.prod.ts" -Encoding utf8

Write-Host ""
Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. cd frontend"
Write-Host "   2. npm start"
Write-Host "   3. Open http://localhost:4200"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
