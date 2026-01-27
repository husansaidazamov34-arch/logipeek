const { Client } = require('pg');
require('dotenv').config();

async function removeOtherAdmins() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Database connected');

    // Get list of admins to be removed
    const adminsToRemove = await client.query(`
      SELECT id, email, full_name 
      FROM users 
      WHERE role = 'admin' 
      AND email != 'shakarovlaziz243@gmail.com'
    `);

    console.log(`\n📋 Admins to be removed: ${adminsToRemove.rows.length}`);
    adminsToRemove.rows.forEach(admin => {
      console.log(`   - ${admin.full_name} (${admin.email})`);
    });

    if (adminsToRemove.rows.length === 0) {
      console.log('\n✅ No other admins found. Only Laziz Shakarov remains.');
      await client.end();
      return;
    }

    // Delete admin actions related to other admins
    const deleteActions1 = await client.query(`
      DELETE FROM admin_actions 
      WHERE admin_id IN (
        SELECT id FROM users 
        WHERE role = 'admin' 
        AND email != 'shakarovlaziz243@gmail.com'
      )
    `);
    console.log(`\n🗑️  Deleted ${deleteActions1.rowCount} admin actions (as admin)`);

    // Delete admin actions where other admins are target users
    const deleteActions2 = await client.query(`
      DELETE FROM admin_actions 
      WHERE target_user_id IN (
        SELECT id FROM users 
        WHERE role = 'admin' 
        AND email != 'shakarovlaziz243@gmail.com'
      )
    `);
    console.log(`🗑️  Deleted ${deleteActions2.rowCount} admin actions (as target)`);

    // Delete driver profiles for admins to be removed
    const deleteDriverProfiles = await client.query(`
      DELETE FROM driver_profiles 
      WHERE user_id IN (
        SELECT id FROM users 
        WHERE role = 'admin' 
        AND email != 'shakarovlaziz243@gmail.com'
      )
    `);
    console.log(`🗑️  Deleted ${deleteDriverProfiles.rowCount} driver profiles`);

    // Delete shipper profiles for admins to be removed
    const deleteShipperProfiles = await client.query(`
      DELETE FROM shipper_profiles 
      WHERE user_id IN (
        SELECT id FROM users 
        WHERE role = 'admin' 
        AND email != 'shakarovlaziz243@gmail.com'
      )
    `);
    console.log(`🗑️  Deleted ${deleteShipperProfiles.rowCount} shipper profiles`);

    // Delete other admin users
    const deleteAdmins = await client.query(`
      DELETE FROM users 
      WHERE role = 'admin' 
      AND email != 'shakarovlaziz243@gmail.com'
    `);
    console.log(`🗑️  Deleted ${deleteAdmins.rowCount} admin users`);

    // Verify: Show remaining admins
    const remainingAdmins = await client.query(`
      SELECT id, email, full_name, role, is_super_admin, is_active 
      FROM users 
      WHERE role = 'admin'
    `);

    console.log(`\n✅ Remaining admins: ${remainingAdmins.rows.length}`);
    remainingAdmins.rows.forEach(admin => {
      console.log(`   - ${admin.full_name} (${admin.email}) - Super Admin: ${admin.is_super_admin}`);
    });

    await client.end();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

removeOtherAdmins();
