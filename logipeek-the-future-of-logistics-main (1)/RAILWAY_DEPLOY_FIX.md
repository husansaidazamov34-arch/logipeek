# Railway Deploy Muammosini Hal Qilish

## 🔧 Muammo
Railway root directory da start command topa olmayapti.

## ✅ Hal Qilingan
1. **Root package.json** - start script qo'shildi
2. **nixpacks.toml** - to'g'ri build va start commands
3. **railway.json** - soddalashtirildi
4. **.gitignore** - node_modules qo'shildi

## 🚀 Railway Dashboard da Manual Sozlash

Agar avtomatik deploy ishlamasa, Railway dashboard da qo'lda sozlang:

### 1. Build Command
```bash
npm install && cd logipeek_backend && npm install && npm run build
```

### 2. Start Command
```bash
npm start
```
yoki
```bash
cd logipeek_backend && npm run start:prod
```

### 3. Environment Variables
Railway dashboard da "Variables" bo'limida quyidagilarni qo'shing:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=logipeek_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d
ENCRYPTION_SECRET=logipeek_encryption_secret_key_for_sensitive_data_2024_change_in_production
CORS_ORIGIN=https://your-frontend-domain.railway.app
SUPER_ADMIN=pes159541@gmail.com
EMAIL_USER=shakarovlaziz243@gmail.com
EMAIL_PASSWORD=brxx eane rdoz gqen
EMAIL_DEV_MODE=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### 4. Health Check
Health check endpoint: `/health`

## 🔄 Qayta Deploy Qilish
1. Railway dashboard da "Redeploy" tugmasini bosing
2. Yoki GitHub ga yangi commit push qiling

## 📝 Tekshirish
Deploy tugagach:
1. `https://your-domain.railway.app/health` - health check
2. `https://your-domain.railway.app/api/docs` - Swagger docs
3. Logs bo'limida xatolarni tekshiring

## 🆘 Muammo Davom Etsa
1. Railway dashboard da "Settings" > "Build & Deploy" ga o'ting
2. Manual ravishda build va start commands kiriting
3. Root Path ni `/` qilib qo'ying (default)