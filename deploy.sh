#!/bin/bash

# Deployment Script for Falcon Security Limited
# Run this after deploying to production

echo "🚀 Falcon Security Deployment Setup"
echo "===================================="
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Step 2: Run Migrations
echo "🔄 Step 2: Running database migrations..."
npx prisma migrate deploy
echo "✅ Migrations applied"
echo ""

# Step 3: Seed Database
echo "🌱 Step 3: Seeding database with Falcon Security data..."
npx prisma db seed
echo "✅ Database seeded"
echo ""

echo "🎉 Deployment setup complete!"
echo ""
echo "📧 Admin Login:"
echo "   Email: admin@falconsecurity.com"
echo "   Password: admin123"
echo ""
echo "🌐 Your application is ready to use!"
