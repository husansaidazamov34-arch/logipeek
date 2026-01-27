const { Pool } = require('pg');
require('dotenv').config();

async function checkEmailStatus() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const email = 'shakarovlaziz243@gmail.com';
    console.log('🔍 Checking email status:', email);
    
    // Check if user exists in database
    const userResult = await pool.query(`
      SELECT 
        id, 
        email, 
        full_name, 
        phone, 
        role, 
        is_active, 
        is_verified, 
        is_super_admin,
        created_at
      FROM users 
      WHERE email = $1
    `, [email]);
    
    if (userResult.rows.length > 0) {
      console.log('\n👤 USER FOUND IN DATABASE:');
      const user = userResult.rows[0];
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  👤 Name: ${user.full_name}`);
      console.log(`  📱 Phone: ${user.phone}`);
      console.log(`  🎭 Role: ${user.role}`);
      console.log(`  ✅ Active: ${user.is_active}`);
      console.log(`  ✅ Verified: ${user.is_verified}`);
      console.log(`  👑 Super Admin: ${user.is_super_admin}`);
      console.log(`  📅 Created: ${user.created_at}`);
      
      // Check if has driver profile
      const driverProfile = await pool.query(
        'SELECT * FROM driver_profiles WHERE user_id = $1',
        [user.id]
      );
      
      if (driverProfile.rows.length > 0) {
        console.log('\n🚗 DRIVER PROFILE FOUND:');
        console.log(`  Vehicle: ${driverProfile.rows[0].vehicle_model}`);
        console.log(`  License Plate: ${driverProfile.rows[0].license_plate}`);
      }
      
      // Check if has shipper profile
      const shipperProfile = await pool.query(
        'SELECT * FROM shipper_profiles WHERE user_id = $1',
        [user.id]
      );
      
      if (shipperProfile.rows.length > 0) {
        console.log('\n📦 SHIPPER PROFILE FOUND:');
        console.log(`  Company: ${shipperProfile.rows[0].company_name || 'N/A'}`);
      }
      
    } else {
      console.log('\n❌ USER NOT FOUND IN DATABASE');
      console.log('✅ Email is available for registration');
    }
    
    // Check current super admin from .env
    const envSuperAdmin = process.env.SUPER_ADMIN;
    console.log(`\n🔧 Current SUPER_ADMIN in .env: ${envSuperAdmin}`);
    
    // Check who is currently super admin in database
    const currentSuperAdmin = await pool.query(
      'SELECT email, full_name FROM users WHERE is_super_admin = true'
    );
    
    if (currentSuperAdmin.rows.length > 0) {
      console.log('\n👑 Current Super Admin in Database:');
      currentSuperAdmin.rows.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.full_name})`);
      });
    } else {
      console.log('\n👑 No Super Admin found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkEmailStatus();