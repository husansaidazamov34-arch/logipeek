# Test Notifications API
Write-Host "🔔 Testing Notifications API..." -ForegroundColor Cyan

# Login as driver
Write-Host "`n1. Login as driver..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"driver@test.com","password":"password123"}'

$token = $loginResponse.access_token
Write-Host "✅ Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Get all notifications
Write-Host "`n2. Get all notifications..." -ForegroundColor Yellow
try {
  $notifications = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/notifications" `
    -Method GET `
    -Headers @{Authorization="Bearer $token"}
  Write-Host "✅ Notifications count: $($notifications.Count)" -ForegroundColor Green
  $notifications | ConvertTo-Json -Depth 3
} catch {
  Write-Host "❌ Error: $_" -ForegroundColor Red
}

# Get unread count
Write-Host "`n3. Get unread count..." -ForegroundColor Yellow
try {
  $unreadCount = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/notifications/unread-count" `
    -Method GET `
    -Headers @{Authorization="Bearer $token"}
  Write-Host "✅ Unread count: $($unreadCount.count)" -ForegroundColor Green
} catch {
  Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "`n✅ Notifications API test completed!" -ForegroundColor Green
