const { Client } = require('pg');
require('dotenv').config();

async function checkConstraints() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check unique constraints on shipments table
    const result = await client.query(`
      SELECT 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name,
        tc.constraint_type
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = 'shipments' 
        AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
      ORDER BY tc.constraint_name;
    `);

    console.log('📋 Constraints on shipments table:');
    console.table(result.rows);

    // Check if there are any shipments with order number SHP-2026-0005
    const shipmentCheck = await client.query(`
      SELECT id, order_number, shipper_id, created_at 
      FROM shipments 
      WHERE order_number LIKE 'SHP-2026-%'
      ORDER BY created_at DESC
      LIMIT 10;
    `);

    console.log('\n📦 Recent shipments:');
    console.table(shipmentCheck.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkConstraints();
