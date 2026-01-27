const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔄 Avtomobil turi o\'rniga avtomobil raqami migratsiyasini boshlash...');

    // Read migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'replace-vehicle-type-with-license-plate-migration.sql'),
      'utf8'
    );

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migratsiya muvaffaqiyatli bajarildi!');
    console.log('📋 O\'zgarishlar:');
    console.log('   - vehicle_type maydoni olib tashlandi');
    console.log('   - license_plate maydoni qo\'shildi (unique constraint bilan)');

  } catch (error) {
    console.error('❌ Migratsiya xatosi:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();