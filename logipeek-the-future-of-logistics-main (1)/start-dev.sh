#!/bin/bash

# LogiPeek Development Server Starter
echo "🚀 Starting LogiPeek Development Servers..."

# Check if PostgreSQL is running
echo ""
echo "📊 Checking PostgreSQL..."
if pg_isready > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running"
else
    echo "⚠️  PostgreSQL is not running. Please start PostgreSQL first."
    echo "   You can start it with: sudo service postgresql start"
    exit 1
fi

# Start Backend
echo ""
echo "🔧 Starting Backend (NestJS)..."
cd logipeek_backend
gnome-terminal -- bash -c "echo '🔧 Backend Server'; npm run start:dev; exec bash" &

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend (React + Vite)..."
cd ../logipeek_frontend
gnome-terminal -- bash -c "echo '🎨 Frontend Server'; npm run dev; exec bash" &

echo ""
echo "✅ Development servers are starting!"
echo ""
echo "📡 Backend:  http://localhost:5000"
echo "📚 API Docs: http://localhost:5000/api/docs"
echo "🎨 Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C in each terminal to stop the servers."
