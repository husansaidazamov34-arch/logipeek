# Railway.app Deploy Guide - LogiPeek

## 🚀 Deploy Qadamlari

### 1. Railway.app ga Kirish
1. [Railway.app](https://railway.app) ga kiring
2. GitHub account bilan login qiling
3. "New Project" tugmasini bosing
4. "Deploy from GitHub repo" ni tanlang
5. LogiPeek repository ni tanlang

### 2. Environment Variables Sozlash

Railway dashboard da "Variables" bo'limiga quyidagi o'zgaruvchilarni qo'shing:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB Configuration
MONGODB_URI=mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=logipeek_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d

# Encryption Configuration
ENCRYPTION_SECRET=logipeek_encryption_secret_key_for_sensitive_data_2024_change_in_production

# CORS Configuration (Railway domain bilan yangilash kerak)
CORS_ORIGIN=https://your-frontend-domain.railway.app

# Super Admin Configuration
SUPER_ADMIN=pes159541@gmail.com

# Email Configuration
EMAIL_USER=shakarovlaziz243@gmail.com
EMAIL_PASSWORD=brxx eane rdoz gqen
EMAIL_DEV_MODE=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### 3. Build va Deploy Sozlamalari

Railway avtomatik ravishda `railway.json` va `nixpacks.toml` fayllarini ishlatadi:

- ✅ Build command: `cd logipeek_backend && npm install && npm run build`
- ✅ Start command: `cd logipeek_backend && npm run start:prod`
- ✅ Health check: `/health` endpoint
- ✅ Node.js 18 versiyasi

### 4. Domain Sozlash

1. Railway dashboard da "Settings" > "Domains" ga o'ting
2. Custom domain qo'shing yoki Railway domain ishlatiladi
3. Frontend uchun CORS_ORIGIN ni yangilang

### 5. Deploy Monitoring

1. "Deployments" bo'limida build jarayonini kuzating
2. Logs bo'limida xatolarni tekshiring
3. Health check `/health` endpoint orqali server holatini tekshiring

## 🔧 Muhim Eslatmalar

### Frontend Deploy
Frontend uchun alohida Railway service yarating:
1. `logipeek_frontend` papkasini deploy qiling
2. Build command: `npm run build`
3. Start command: `npm run preview` yoki static hosting

### Database
- ✅ MongoDB Atlas ishlatilmoqda (cloud database)
- ✅ Connection string `.env` da mavjud
- ✅ Qo'shimcha database sozlash kerak emas

### SSL Certificate
- ✅ Railway avtomatik SSL certificate beradi
- ✅ HTTPS avtomatik yoqiladi

### Monitoring
- Railway dashboard da CPU, Memory, Network usage ko'rish mumkin
- Logs real-time kuzatish mumkin

## 🚨 Deploy Oldidan Tekshirish

1. ✅ MongoDB Atlas connection ishlayotganini tekshiring
2. ✅ Email credentials to'g'ri ekanligini tekshiring
3. ✅ JWT secret production uchun o'zgartirilganini tekshiring
4. ✅ CORS origin frontend domain bilan mos kelishini tekshiring

## 📞 Yordam

Agar deploy jarayonida muammo bo'lsa:
1. Railway logs ni tekshiring
2. Health check endpoint `/health` ga so'rov yuboring
3. Environment variables to'g'ri sozlanganini tekshiring