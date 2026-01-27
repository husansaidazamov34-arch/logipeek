const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runMigration() {
  try {
    console.log('Running license image migration...');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'add-license-image-migration.sql'),
      'utf8'
    );
    
    await pool.query(migrationSQL);
    console.log('✅ License image migration completed successfully!');
    
    // Verify the column was added
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'driver_profiles' AND column_name = 'license_image_url'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Column license_image_url added successfully:', result.rows[0]);
    } else {
      console.log('❌ Column was not added');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();