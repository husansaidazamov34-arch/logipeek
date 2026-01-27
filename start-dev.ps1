# LogiPeek Development Server Starter
Write-Host "🚀 Starting LogiPeek Development Servers..." -ForegroundColor Green

# Check if PostgreSQL is running
Write-Host "`n📊 Checking PostgreSQL..." -ForegroundColor Yellow
$pgStatus = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if ($pgStatus -and $pgStatus.Status -eq 'Running') {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL is not running. Please start PostgreSQL first." -ForegroundColor Red
    Write-Host "   You can start it with: net start postgresql-x64-XX" -ForegroundColor Yellow
    exit 1
}

# Start Backend
Write-Host "`n🔧 Starting Backend (NestJS)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\logipeek_backend'; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; npm run start:dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "`n🎨 Starting Frontend (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\logipeek_frontend'; Write-Host '🎨 Frontend Server' -ForegroundColor Magenta; npm run dev"

Write-Host "`n✅ Development servers are starting!" -ForegroundColor Green
Write-Host "`n📡 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:5000/api/docs" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:8080" -ForegroundColor Magenta
Write-Host "`nPress Ctrl+C in each window to stop the servers." -ForegroundColor Yellow
