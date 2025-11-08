#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations complete!"
echo "🚀 Starting server..."
exec npx tsx src/index.ts
