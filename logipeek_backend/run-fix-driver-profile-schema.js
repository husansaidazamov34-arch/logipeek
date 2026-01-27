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
    console.log('🔄 Driver profile schema tuzatish migratsiyasini boshlash...');

    // Read migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'fix-driver-profile-schema-migration.sql'),
      'utf8'
    );

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migratsiya muvaffaqiyatli bajarildi!');
    console.log('📋 O\'zgarishlar:');
    console.log('   - license_image_url ustuni qo\'shildi');
    console.log('   - is_license_approved ustuni qo\'shildi');
    console.log('   - license_approved_by ustuni qo\'shildi');
    console.log('   - license_approved_at ustuni qo\'shildi');
    console.log('   - Foreign key constraint qo\'shildi');

  } catch (error) {
    console.error('❌ Migratsiya xatosi:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();