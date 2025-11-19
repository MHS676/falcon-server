# Deployment Script for Falcon Security Limited (Windows PowerShell)
# Run this after deploying to production

Write-Host "🚀 Falcon Security Deployment Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Step 2: Run Migrations
Write-Host "🔄 Step 2: Running database migrations..." -ForegroundColor Yellow
npx prisma migrate deploy
Write-Host "✅ Migrations applied" -ForegroundColor Green
Write-Host ""

# Step 3: Seed Database
Write-Host "🌱 Step 3: Seeding database with Falcon Security data..." -ForegroundColor Yellow
npx prisma db seed
Write-Host "✅ Database seeded" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Deployment setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📧 Admin Login:" -ForegroundColor White
Write-Host "   Email: admin@falconsecurity.com" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your application is ready to use!" -ForegroundColor Green
