const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0';

// User schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'DRIVER', 'SHIPPER'], required: true },
  isActive: { type: Boolean, default: true },
  isSuperAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB ga ulandi');

    const User = mongoose.model('User', userSchema);

    const superAdminEmail = 'pes159541@gmail.com';
    const password = 'SuperAdmin123!'; // Bu parolni o'zgartiring

    // Mavjud super admin tekshirish
    const existingUser = await User.findOne({ email: superAdminEmail });

    if (existingUser) {
      // Mavjud foydalanuvchini admin qilish
      existingUser.role = 'ADMIN';
      existingUser.isActive = true;
      existingUser.isSuperAdmin = true;
      await existingUser.save();
      console.log(`✅ Mavjud foydalanuvchi super admin qilindi: ${superAdminEmail}`);
    } else {
      // Yangi super admin yaratish
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = new User({
        fullName: 'Super Administrator',
        email: superAdminEmail,
        phone: '+998901234567',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isSuperAdmin: true
      });

      await superAdmin.save();
      console.log(`✅ Yangi super admin yaratildi: ${superAdminEmail}`);
      console.log(`📧 Email: ${superAdminEmail}`);
      console.log(`🔑 Parol: ${password}`);
      console.log('⚠️  Parolni o\'zgartirishni unutmang!');
    }

    await mongoose.disconnect();
    console.log('MongoDB dan uzildi');

  } catch (error) {
    console.error('❌ Xatolik:', error);
    process.exit(1);
  }
}

createSuperAdmin();