# Helper script to deploy to Railway
Write-Host "🔄 Switching to PostgreSQL..." -ForegroundColor Cyan
.\switch-to-postgres.ps1

Write-Host "📦 Committing and pushing..." -ForegroundColor Cyan
git add .
git commit -m "deploy: $args"
git push origin master

Write-Host "🔄 Switching back to SQLite for local dev..." -ForegroundColor Cyan
.\switch-to-sqlite.ps1
npx prisma generate

Write-Host "✅ Deployed! Railway will redeploy in ~2 minutes." -ForegroundColor Green
