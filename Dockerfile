# Node.js 20 ishlatish
FROM node:20-alpine

# Ish katalogini yaratish
WORKDIR /app/logipeek_backend

# Package.json fayllarini nusxalash
COPY logipeek_backend/package*.json ./

# Dependencies o'rnatish
RUN npm install

# Backend kodini nusxalash
COPY logipeek_backend/ ./

# Build qilish
RUN npm run build

# Port ochish
EXPOSE 5000

# Ishga tushirish
CMD ["node", "dist/main"]