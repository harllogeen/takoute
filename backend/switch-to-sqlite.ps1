# Switch schema to SQLite for local dev
(Get-Content prisma/schema.prisma) -replace 'provider = "postgresql"', 'provider = "sqlite"' | Set-Content prisma/schema.prisma
Write-Host "✅ Switched to SQLite. Run: npx prisma generate"
