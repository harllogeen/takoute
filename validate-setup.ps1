# ChopNow Setup Validation Script
# Run this to verify your setup is correct

Write-Host "🔍 ChopNow Setup Validator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$issues = 0

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(\d+)\.") {
        $majorVersion = [int]$Matches[1]
        if ($majorVersion -ge 18) {
            Write-Host " ✅ $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host " ❌ Version $nodeVersion (need 18+)" -ForegroundColor Red
            $issues++
        }
    }
} catch {
    Write-Host " ❌ Not installed" -ForegroundColor Red
    $issues++
}

# Check npm
Write-Host "Checking npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " ✅ v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not installed" -ForegroundColor Red
    $issues++
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -NoNewline
try {
    $pgVersion = psql --version
    Write-Host " ✅ $pgVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not installed or not in PATH" -ForegroundColor Yellow
    Write-Host "   Install from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    $issues++
}

# Check Angular CLI
Write-Host "Checking Angular CLI..." -NoNewline
try {
    $ngVersion = ng version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Installed" -ForegroundColor Green
    } else {
        Write-Host " ❌ Not installed" -ForegroundColor Red
        Write-Host "   Run: npm install -g @angular/cli" -ForegroundColor Yellow
        $issues++
    }
} catch {
    Write-Host " ❌ Not installed" -ForegroundColor Red
    Write-Host "   Run: npm install -g @angular/cli" -ForegroundColor Yellow
    $issues++
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

# Check backend files
Write-Host "Checking backend files..." -NoNewline
if (Test-Path "backend/package.json") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌ backend/package.json not found" -ForegroundColor Red
    $issues++
}

Write-Host "Checking backend .env..." -NoNewline
if (Test-Path "backend/.env") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ⚠️  Not found (copy from .env.example)" -ForegroundColor Yellow
    $issues++
}

Write-Host "Checking Prisma schema..." -NoNewline
if (Test-Path "backend/prisma/schema.prisma") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌ Not found" -ForegroundColor Red
    $issues++
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

# Summary
Write-Host ""
if ($issues -eq 0) {
    Write-Host "✅ All checks passed! You're ready to start." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. cd backend" -ForegroundColor White
    Write-Host "2. npm install" -ForegroundColor White
    Write-Host "3. npm run prisma:generate" -ForegroundColor White
    Write-Host "4. npm run prisma:migrate" -ForegroundColor White
    Write-Host "5. npm run prisma:seed" -ForegroundColor White
    Write-Host "6. npm run dev" -ForegroundColor White
} else {
    Write-Host "❌ Found $issues issue(s). Please fix them before proceeding." -ForegroundColor Red
    Write-Host ""
    Write-Host "For help, see: SETUP.md" -ForegroundColor Yellow
}

Write-Host ""
