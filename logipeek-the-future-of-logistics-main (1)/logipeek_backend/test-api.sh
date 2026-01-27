#!/bin/bash

# LogiPeek API Test Script
# Bash script to test all API endpoints using curl

BASE_URL="http://localhost:5000/api/v1"

echo "🚀 LogiPeek API Test Script"
echo "================================"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
response=$(curl -s http://localhost:5000/health)
if [ $? -eq 0 ]; then
    echo "✅ Health Check: OK"
    echo "   Response: $response"
    echo ""
else
    echo "❌ Health Check Failed"
    echo ""
fi

# Test 2: Register Driver
echo "2️⃣  Registering Driver..."
driver_response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.driver@logipeek.uz",
    "password": "password123",
    "fullName": "Test Haydovchi",
    "phone": "+998901111111",
    "role": "driver",
    "vehicleType": "truck",
    "vehicleModel": "Isuzu NPR",
    "licensePlate": "01 T 999 ST",
    "licenseNumber": "DL999999"
  }')

if echo "$driver_response" | grep -q "token"; then
    echo "✅ Driver Registered Successfully!"
    driver_token=$(echo "$driver_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    driver_id=$(echo "$driver_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "   Token: ${driver_token:0:30}..."
    echo ""
else
    echo "⚠️  Driver might already exist, trying login..."
    driver_response=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test.driver@logipeek.uz",
        "password": "password123"
      }')
    
    if echo "$driver_response" | grep -q "token"; then
        echo "✅ Driver Logged In!"
        driver_token=$(echo "$driver_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        driver_id=$(echo "$driver_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo ""
    else
        echo "❌ Login Failed"
        echo ""
    fi
fi

# Test 3: Register Shipper
echo "3️⃣  Registering Shipper..."
shipper_response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.shipper@logipeek.uz",
    "password": "password123",
    "fullName": "Test Yuk Beruvchi",
    "phone": "+998902222222",
    "role": "shipper",
    "companyName": "Test Logistics LLC",
    "companyAddress": "Tashkent, Chilanzar"
  }')

if echo "$shipper_response" | grep -q "token"; then
    echo "✅ Shipper Registered Successfully!"
    shipper_token=$(echo "$shipper_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    shipper_id=$(echo "$shipper_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "   Token: ${shipper_token:0:30}..."
    echo ""
else
    echo "⚠️  Shipper might already exist, trying login..."
    shipper_response=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test.shipper@logipeek.uz",
        "password": "password123"
      }')
    
    if echo "$shipper_response" | grep -q "token"; then
        echo "✅ Shipper Logged In!"
        shipper_token=$(echo "$shipper_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        shipper_id=$(echo "$shipper_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo ""
    else
        echo "❌ Login Failed"
        echo ""
    fi
fi

# Test 4: Get Current User (Driver)
echo "4️⃣  Getting Driver Profile..."
profile_response=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $driver_token")

if echo "$profile_response" | grep -q "fullName"; then
    echo "✅ Driver Profile Retrieved!"
    echo "   Response: $profile_response" | head -c 200
    echo "..."
    echo ""
else
    echo "❌ Failed to get profile"
    echo ""
fi

# Test 5: Create Shipment (as Shipper)
echo "5️⃣  Creating Shipment..."
shipment_response=$(curl -s -X POST "$BASE_URL/shipments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $shipper_token" \
  -d '{
    "pickupAddress": "Tashkent, Mirabad tumani",
    "pickupLatitude": 41.2995,
    "pickupLongitude": 69.2401,
    "pickupContactName": "Alisher",
    "pickupContactPhone": "+998901234567",
    "dropoffAddress": "Samarkand, Registon maydoni",
    "dropoffLatitude": 39.6542,
    "dropoffLongitude": 66.9597,
    "dropoffContactName": "Nodira",
    "dropoffContactPhone": "+998909876543",
    "weight": 750,
    "vehicleTypeRequired": "truck",
    "description": "Test jonatma",
    "estimatedPrice": 580000,
    "distanceKm": 298
  }')

if echo "$shipment_response" | grep -q "orderNumber"; then
    echo "✅ Shipment Created!"
    shipment_id=$(echo "$shipment_response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    order_number=$(echo "$shipment_response" | grep -o '"orderNumber":"[^"]*' | cut -d'"' -f4)
    echo "   Order Number: $order_number"
    echo "   Shipment ID: $shipment_id"
    echo ""
else
    echo "❌ Failed to create shipment"
    echo "   Response: $shipment_response"
    echo ""
fi

# Test 6: Get Available Orders (as Driver)
echo "6️⃣  Getting Available Orders..."
orders_response=$(curl -s -X GET "$BASE_URL/orders/available" \
  -H "Authorization: Bearer $driver_token")

if echo "$orders_response" | grep -q "orderNumber"; then
    echo "✅ Available Orders Retrieved!"
    order_count=$(echo "$orders_response" | grep -o '"orderNumber"' | wc -l)
    echo "   Total Orders: $order_count"
    echo ""
else
    echo "⚠️  No available orders or failed"
    echo ""
fi

# Test 7: Accept Order (as Driver)
if [ ! -z "$shipment_id" ]; then
    echo "7️⃣  Accepting Order..."
    accept_response=$(curl -s -X POST "$BASE_URL/orders/$shipment_id/accept" \
      -H "Authorization: Bearer $driver_token")
    
    if echo "$accept_response" | grep -q "accepted"; then
        echo "✅ Order Accepted!"
        echo "   Status: accepted"
        echo ""
    else
        echo "⚠️  Order might already be accepted"
        echo ""
    fi
fi

# Test 8: Update Driver Location
echo "8️⃣  Updating Driver Location..."
location_response=$(curl -s -X PUT "$BASE_URL/drivers/location" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $driver_token" \
  -d '{
    "latitude": 41.3111,
    "longitude": 69.2797
  }')

if echo "$location_response" | grep -q "currentLatitude"; then
    echo "✅ Location Updated!"
    echo ""
else
    echo "❌ Failed to update location"
    echo ""
fi

# Test 9: Update Shipment Status
if [ ! -z "$shipment_id" ]; then
    echo "9️⃣  Updating Shipment Status..."
    status_response=$(curl -s -X PUT "$BASE_URL/shipments/$shipment_id/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $driver_token" \
      -d '{
        "status": "transit",
        "notes": "Yolga chiqdim",
        "latitude": 41.3111,
        "longitude": 69.2797
      }')
    
    if echo "$status_response" | grep -q "transit"; then
        echo "✅ Status Updated to Transit!"
        echo ""
    else
        echo "⚠️  Status update might have failed"
        echo ""
    fi
fi

# Test 10: Get Driver Stats
echo "🔟 Getting Driver Statistics..."
stats_response=$(curl -s -X GET "$BASE_URL/drivers/stats/me" \
  -H "Authorization: Bearer $driver_token")

if echo "$stats_response" | grep -q "totalTrips"; then
    echo "✅ Statistics Retrieved!"
    echo "   Response: $stats_response" | head -c 200
    echo "..."
    echo ""
else
    echo "❌ Failed to get statistics"
    echo ""
fi

echo "================================"
echo "✅ API Testing Completed!"
echo ""
echo "📚 View full API docs at: http://localhost:5000/api/docs"
echo ""
echo "🔑 Saved Tokens:"
echo "   Driver Token: ${driver_token:0:40}..."
echo "   Shipper Token: ${shipper_token:0:40}..."
echo ""
