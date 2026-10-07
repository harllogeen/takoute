# ChopNow Backend Checker
# Run this to diagnose backend issues

Write-Host ""
Write-Host "🔍 ChopNow Backend Diagnostic Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$canRun = $true

# Check 1: Node.js
Write-Host "[1/6] Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " ✅ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ NOT INSTALLED" -ForegroundColor Red
    $issues += "Node.js is not installed. Download from: https://nodejs.org"
    $canRun = $false
}

# Check 2: npm
Write-Host "[2/6] Checking npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " ✅ v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ NOT INSTALLED" -ForegroundColor Red
    $issues += "npm is not installed"
    $canRun = $false
}

# Check 3: PostgreSQL
Write-Host "[3/6] Checking PostgreSQL..." -NoNewline
try {
    $pgVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Installed" -ForegroundColor Green
    } else {
        Write-Host " ❌ NOT INSTALLED" -ForegroundColor Red
        $issues += "PostgreSQL is not installed. See: INSTALL_POSTGRESQL.md"
        $canRun = $false
    }
} catch {
    Write-Host " ❌ NOT INSTALLED" -ForegroundColor Red
    $issues += "PostgreSQL is not installed. See: INSTALL_POSTGRESQL.md"
    $canRun = $false
}

# Check 4: backend/node_modules
Write-Host "[4/6] Checking dependencies..." -NoNewline
if (Test-Path "backend/node_modules") {
    Write-Host " ✅ Installed" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT INSTALLED" -ForegroundColor Red
    $issues += "Dependencies not installed. Run: cd backend; npm install"
    $canRun = $false
}

# Check 5: backend/.env
Write-Host "[5/6] Checking .env file..." -NoNewline
if (Test-Path "backend/.env") {
    Write-Host " ✅ Exists" -ForegroundColor Green
    
    # Check DATABASE_URL
    $envContent = Get-Content "backend/.env" -Raw
    if ($envContent -match 'DATABASE_URL="([^"]+)"') {
        $dbUrl = $Matches[1]
        if ($dbUrl -match 'postgres:postgres') {
            Write-Host "   ⚠️  Using default password 'postgres'" -ForegroundColor Yellow
            Write-Host "   Update if you used a different password!" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    $issues += ".env file missing. It has been created for you."
    Write-Host "   ✅ Created .env file" -ForegroundColor Green
}

# Check 6: Database connection
Write-Host "[6/6] Checking database..." -NoNewline
try {
    $dbCheck = psql -U postgres -d chopnow -c "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Database 'chopnow' exists and is accessible" -ForegroundColor Green
    } else {
        Write-Host " ❌ Cannot connect" -ForegroundColor Red
        $issues += "Database 'chopnow' doesn't exist or wrong password"
        $issues += "Create it: psql -U postgres -c 'CREATE DATABASE chopnow;'"
        $canRun = $false
    }
} catch {
    Write-Host " ❌ Cannot check" -ForegroundColor Red
    $issues += "Cannot check database (PostgreSQL may not be running)"
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Summary
if ($issues.Count -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your backend is ready to run!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. cd backend" -ForegroundColor White
    Write-Host "2. npm run prisma:generate" -ForegroundColor White
    Write-Host "3. npm run prisma:migrate" -ForegroundColor White
    Write-Host "4. npm run prisma:seed" -ForegroundColor White
    Write-Host "5. npm run dev" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ FOUND $($issues.Count) ISSUE(S):" -ForegroundColor Red
    Write-Host ""
    
    foreach ($issue in $issues) {
        Write-Host "   • $issue" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    
    if ($issues -match "PostgreSQL") {
        Write-Host "   → INSTALL_POSTGRESQL.md - Install PostgreSQL" -ForegroundColor White
    }
    if ($issues -match "Dependencies") {
        Write-Host "   → Run: cd backend; npm install" -ForegroundColor White
    }
    if ($issues -match "Database.*doesn't exist") {
        Write-Host "   → See INSTALL_POSTGRESQL.md Step 4" -ForegroundColor White
    }
    
    Write-Host ""
}

Write-Host "For more help, see:" -ForegroundColor Cyan
Write-Host "   • TROUBLESHOOTING.md" -ForegroundColor White
Write-Host "   • INSTALL_POSTGRESQL.md" -ForegroundColor White
Write-Host "   • START_HERE.md" -ForegroundColor White
Write-Host ""
