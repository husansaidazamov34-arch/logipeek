# Node.js 20 ishlatish
FROM node:20-alpine

# Ish katalogini yaratish
WORKDIR /app

# Package.json fayllarini nusxalash
COPY package*.json ./
COPY logipeek_backend/package*.json ./logipeek_backend/

# Root dependencies o'rnatish
RUN npm install

# Backend katalogiga o'tish va dependencies o'rnatish
WORKDIR /app/logipeek_backend
RUN npm install

# Backend kodini nusxalash
COPY logipeek_backend/ ./

# Build qilish
RUN npm run build

# Port ochish
EXPOSE 5000

# Ishga tushirish
CMD ["npm", "run", "start:prod"]