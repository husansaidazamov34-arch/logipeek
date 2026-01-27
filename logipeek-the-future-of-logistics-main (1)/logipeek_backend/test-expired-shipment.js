const { Client } = require('pg');

async function createTestExpiredShipment() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'logipeek_db',
    user: 'postgres',
    password: 'Laziz2006.',
  });

  try {
    await client.connect();
    console.log('✅ Database ga ulandi');

    // 2 soat 30 daqiqa oldingi vaqt (test uchun)
    const expiredTime = new Date();
    expiredTime.setHours(expiredTime.getHours() - 2.5);

    // Test buyurtma yaratish
    const insertQuery = `
      INSERT INTO shipments (
        id, order_number, shipper_id, driver_id, pickup_address, pickup_latitude, pickup_longitude,
        dropoff_address, dropoff_latitude, dropoff_longitude, weight, vehicle_type_required,
        estimated_price, status, accepted_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(),
        'TEST-EXPIRED-001',
        (SELECT id FROM users WHERE role = 'shipper' LIMIT 1),
        (SELECT id FROM users WHERE role = 'driver' LIMIT 1),
        'Test Pickup Address',
        41.2995,
        69.2401,
        'Test Dropoff Address',
        39.6542,
        66.9597,
        500,
        'Yuk mashinasi',
        50000,
        'accepted',
        $1,
        NOW(),
        NOW()
      )
      RETURNING id, order_number, accepted_at;
    `;

    const result = await client.query(insertQuery, [expiredTime]);
    
    if (result.rows.length > 0) {
      const shipment = result.rows[0];
      console.log('📦 Test buyurtma yaratildi:');
      console.log(`   ID: ${shipment.id}`);
      console.log(`   Order Number: ${shipment.order_number}`);
      console.log(`   Accepted At: ${shipment.accepted_at}`);
      console.log(`   Muddat: ${expiredTime.toLocaleString('uz-UZ')}`);
      console.log('');
      console.log('🧪 Endi scheduler test qilish uchun quyidagi endpoint ga POST so\'rov yuboring:');
      console.log('   POST http://localhost:5000/api/v1/scheduler/trigger-expired-check');
      console.log('   (Admin token bilan)');
    }

  } catch (error) {
    console.error('❌ Xatolik:', error.message);
  } finally {
    await client.end();
  }
}

createTestExpiredShipment();