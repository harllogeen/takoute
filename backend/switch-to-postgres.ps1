# Switch schema to PostgreSQL for Railway deployment
(Get-Content prisma/schema.prisma) -replace 'provider = "sqlite"', 'provider = "postgresql"' | Set-Content prisma/schema.prisma
Write-Host "✅ Switched to PostgreSQL. Commit and push to deploy to Railway."
