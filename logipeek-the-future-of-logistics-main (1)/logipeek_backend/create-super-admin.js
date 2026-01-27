const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'logipeek_db',
});

async function createSuperAdmin() {
  try {
    console.log('🔧 Admin features migration boshlandi...');

    // Add new columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS created_by_admin_id UUID REFERENCES users(id);
    `);
    console.log('✅ Users table yangilandi');

    // Create admin_actions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_actions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        metadata JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Admin actions table yaratildi');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
      CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);
      CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON admin_actions(action);
      CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);
    `);
    console.log('✅ Indexlar yaratildi');

    // Check if super admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['shakarovlaziz243@gmail.com']
    );

    if (existingAdmin.rows.length === 0) {
      // Hash password
      const passwordHash = await bcrypt.hash('password123', 10);

      // Create super admin
      const result = await pool.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          phone, 
          role, 
          is_active, 
          is_verified, 
          is_super_admin
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        'shakarovlaziz243@gmail.com',
        passwordHash,
        'Laziz Shakarov',
        '+998901234567',
        'admin',
        true,
        true,
        true
      ]);

      const adminId = result.rows[0].id;

      console.log('✅ Super admin yaratildi');
      console.log('📧 Email: shakarovlaziz243@gmail.com');
      console.log('🔑 Parol: password123');
    } else {
      // Update existing user to super admin
      await pool.query(
        'UPDATE users SET is_super_admin = true WHERE email = $1',
        ['shakarovlaziz243@gmail.com']
      );
      console.log('✅ Mavjud admin super admin qilindi');
    }

    console.log('🎉 Migration muvaffaqiyatli yakunlandi!');
  } catch (error) {
    console.error('❌ Migration xatosi:', error);
  } finally {
    await pool.end();
  }
}

createSuperAdmin();