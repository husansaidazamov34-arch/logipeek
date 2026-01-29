// Simple super admin creation script for Railway
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0';

async function createSuperAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ MongoDB ga ulandi');
    
    const db = client.db('logipeek_db');
    const users = db.collection('users');
    
    const superAdminEmail = 'pes159541@gmail.com';
    
    // Mavjud foydalanuvchini topish
    const existingUser = await users.findOne({ email: superAdminEmail });
    
    if (existingUser) {
      // Mavjud foydalanuvchini super admin qilish
      const result = await users.updateOne(
        { email: superAdminEmail },
        { 
          $set: { 
            role: 'ADMIN',
            isActive: true,
            isSuperAdmin: true,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ ${superAdminEmail} super admin qilindi`);
      } else {
        console.log(`ℹ️  ${superAdminEmail} allaqachon super admin`);
      }
    } else {
      console.log(`❌ ${superAdminEmail} foydalanuvchisi topilmadi`);
      console.log('Avval ro\'yxatdan o\'ting, keyin qayta urinib ko\'ring');
    }
    
  } catch (error) {
    console.error('❌ Xatolik:', error.message);
  } finally {
    await client.close();
    console.log('🔌 MongoDB dan uzildi');
  }
}

createSuperAdmin();