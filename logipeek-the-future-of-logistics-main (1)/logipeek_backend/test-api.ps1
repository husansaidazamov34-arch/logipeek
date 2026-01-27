# LogiPeek API Test Script
# PowerShell script to test all API endpoints

$baseUrl = "http://localhost:5000/api/v1"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "🚀 LogiPeek API Test Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Register Driver
Write-Host "2️⃣  Registering Driver..." -ForegroundColor Yellow
$driverData = @{
    email = "test.driver@logipeek.uz"
    password = "password123"
    fullName = "Test Haydovchi"
    phone = "+998901111111"
    role = "driver"
    vehicleType = "truck"
    vehicleModel = "Isuzu NPR"
    licensePlate = "01 T 999 ST"
    licenseNumber = "DL999999"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $driverData -Headers $headers
    $driverToken = $response.token
    $driverId = $response.user.id
    Write-Host "✅ Driver Registered Successfully!" -ForegroundColor Green
    Write-Host "   ID: $driverId" -ForegroundColor Gray
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Token: $($driverToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️  Driver might already exist, trying login..." -ForegroundColor Yellow
    
    # Try login instead
    $loginData = @{
        email = "test.driver@logipeek.uz"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -Headers $headers
        $driverToken = $response.token
        $driverId = $response.user.id
        Write-Host "✅ Driver Logged In!" -ForegroundColor Green
        Write-Host "   ID: $driverId" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 3: Register Shipper
Write-Host "3️⃣  Registering Shipper..." -ForegroundColor Yellow
$shipperData = @{
    email = "test.shipper@logipeek.uz"
    password = "password123"
    fullName = "Test Yuk Beruvchi"
    phone = "+998902222222"
    role = "shipper"
    companyName = "Test Logistics LLC"
    companyAddress = "Tashkent, Chilanzar"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $shipperData -Headers $headers
    $shipperToken = $response.token
    $shipperId = $response.user.id
    Write-Host "✅ Shipper Registered Successfully!" -ForegroundColor Green
    Write-Host "   ID: $shipperId" -ForegroundColor Gray
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Company: $($response.user.shipperProfile.companyName)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️  Shipper might already exist, trying login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "test.shipper@logipeek.uz"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -Headers $headers
        $shipperToken = $response.token
        $shipperId = $response.user.id
        Write-Host "✅ Shipper Logged In!" -ForegroundColor Green
        Write-Host "   ID: $shipperId" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 4: Get Current User (Driver)
Write-Host "4️⃣  Getting Driver Profile..." -ForegroundColor Yellow
$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $driverToken"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $authHeaders
    Write-Host "✅ Driver Profile Retrieved!" -ForegroundColor Green
    Write-Host "   Name: $($response.fullName)" -ForegroundColor Gray
    Write-Host "   Role: $($response.role)" -ForegroundColor Gray
    Write-Host "   Vehicle: $($response.driverProfile.vehicleModel)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Create Shipment (as Shipper)
Write-Host "5️⃣  Creating Shipment..." -ForegroundColor Yellow
$shipperAuthHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $shipperToken"
}

$shipmentData = @{
    pickupAddress = "Tashkent, Mirabad tumani"
    pickupLatitude = 41.2995
    pickupLongitude = 69.2401
    pickupContactName = "Alisher"
    pickupContactPhone = "+998901234567"
    dropoffAddress = "Samarkand, Registon maydoni"
    dropoffLatitude = 39.6542
    dropoffLongitude = 66.9597
    dropoffContactName = "Nodira"
    dropoffContactPhone = "+998909876543"
    weight = 750
    vehicleTypeRequired = "truck"
    description = "Test jo'natma"
    estimatedPrice = 580000
    distanceKm = 298
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/shipments" -Method Post -Body $shipmentData -Headers $shipperAuthHeaders
    $shipmentId = $response.id
    Write-Host "✅ Shipment Created!" -ForegroundColor Green
    Write-Host "   Order Number: $($response.orderNumber)" -ForegroundColor Gray
    Write-Host "   From: $($response.pickupAddress)" -ForegroundColor Gray
    Write-Host "   To: $($response.dropoffAddress)" -ForegroundColor Gray
    Write-Host "   Price: $($response.estimatedPrice) so'm" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 6: Get Available Orders (as Driver)
Write-Host "6️⃣  Getting Available Orders..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/orders/available" -Method Get -Headers $authHeaders
    Write-Host "✅ Available Orders Retrieved!" -ForegroundColor Green
    Write-Host "   Total Orders: $($response.Count)" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   First Order: $($response[0].orderNumber)" -ForegroundColor Gray
        Write-Host "   Price: $($response[0].estimatedPrice) so'm" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 7: Accept Order (as Driver)
if ($shipmentId) {
    Write-Host "7️⃣  Accepting Order..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/orders/$shipmentId/accept" -Method Post -Headers $authHeaders
        Write-Host "✅ Order Accepted!" -ForegroundColor Green
        Write-Host "   Order: $($response.orderNumber)" -ForegroundColor Gray
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
        Write-Host "   Driver: $($response.driver.fullName)" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 8: Update Driver Location
Write-Host "8️⃣  Updating Driver Location..." -ForegroundColor Yellow
$locationData = @{
    latitude = 41.3111
    longitude = 69.2797
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/drivers/location" -Method Put -Body $locationData -Headers $authHeaders
    Write-Host "✅ Location Updated!" -ForegroundColor Green
    Write-Host "   Latitude: $($response.currentLatitude)" -ForegroundColor Gray
    Write-Host "   Longitude: $($response.currentLongitude)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 9: Update Shipment Status
if ($shipmentId) {
    Write-Host "9️⃣  Updating Shipment Status..." -ForegroundColor Yellow
    $statusData = @{
        status = "transit"
        notes = "Yo'lga chiqdim"
        latitude = 41.3111
        longitude = 69.2797
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/shipments/$shipmentId/status" -Method Put -Body $statusData -Headers $authHeaders
        Write-Host "✅ Status Updated!" -ForegroundColor Green
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
        Write-Host "   Order: $($response.orderNumber)" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 10: Get Driver Stats
Write-Host "🔟 Getting Driver Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/drivers/stats/me" -Method Get -Headers $authHeaders
    Write-Host "✅ Statistics Retrieved!" -ForegroundColor Green
    Write-Host "   Total Trips: $($response.totalTrips)" -ForegroundColor Gray
    Write-Host "   Rating: $($response.rating)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ API Testing Completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 View full API docs at: http://localhost:5000/api/docs" -ForegroundColor Cyan
Write-Host ""
