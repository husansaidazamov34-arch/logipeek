# LogiPeek Backend API (NestJS)

Modern logistics platform backend with PostgreSQL database and TypeORM.

## Features

- 🚀 RESTful API with NestJS
- 🗄️ PostgreSQL database with TypeORM
- 🔐 JWT authentication with Passport
- 🔒 Security with Guards and Decorators
- 📡 Real-time updates with WebSockets
- ✅ Class-validator for input validation
- 📚 Swagger API documentation
- 🌐 CORS enabled
- 🏗️ Modular architecture

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Make sure PostgreSQL is running

# Database will auto-sync in development mode
# Or run migrations manually:
npm run typeorm migration:run

# Start development server
npm run start:dev

# Access Swagger docs at http://localhost:5000/api/docs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Ro'yxatdan o'tish
- `POST /api/v1/auth/login` - Tizimga kirish
- `GET /api/v1/auth/me` - Joriy foydalanuvchi ma'lumotlari

### Users
- `GET /api/v1/users/:id` - Foydalanuvchi ma'lumotlarini olish
- `PUT /api/v1/users/:id` - Foydalanuvchi ma'lumotlarini yangilash

### Shipments (Yuk beruvchi)
- `POST /api/v1/shipments` - Yangi jo'natma yaratish
- `GET /api/v1/shipments` - Barcha jo'natmalarni olish
- `GET /api/v1/shipments/:id` - Jo'natma ma'lumotlarini olish
- `PUT /api/v1/shipments/:id/status` - Jo'natma statusini yangilash

### Orders (Haydovchi)
- `GET /api/v1/orders/available` - Mavjud buyurtmalarni olish
- `GET /api/v1/orders/active` - Faol buyurtmalarni olish
- `GET /api/v1/orders/history` - Buyurtmalar tarixini olish
- `POST /api/v1/orders/:id/accept` - Buyurtmani qabul qilish

### Drivers
- `GET /api/v1/drivers` - Barcha haydovchilarni olish
- `GET /api/v1/drivers/:id` - Haydovchi ma'lumotlarini olish
- `PUT /api/v1/drivers/location` - Haydovchi lokatsiyasini yangilash
- `PUT /api/v1/drivers/status` - Haydovchi statusini yangilash
- `GET /api/v1/drivers/stats/me` - Haydovchi statistikasini olish

### Notifications
- `GET /api/v1/notifications` - Barcha bildirishnomalarni olish
- `GET /api/v1/notifications/unread-count` - O'qilmagan bildirishnomalar soni
- `PUT /api/v1/notifications/:id/read` - Bildirishnomani o'qilgan deb belgilash
- `PUT /api/v1/notifications/read-all` - Barcha bildirishnomalarni o'qilgan deb belgilash

## Database Schema

Database automatically syncs in development mode. See entities in `src/entities/` for structure.

### Main Tables:
- `users` - Foydalanuvchilar (haydovchilar va yuk beruvchilar)
- `driver_profiles` - Haydovchi profillari
- `shipper_profiles` - Yuk beruvchi profillari
- `shipments` - Jo'natmalar/Buyurtmalar
- `shipment_status_history` - Jo'natma status tarixi
- `notifications` - Bildirishnomalar

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
src/
├── config/              # Configuration files
├── entities/            # TypeORM entities (database models)
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   ├── users/          # Users module
│   ├── shipments/      # Shipments module
│   ├── drivers/        # Drivers module
│   ├── orders/         # Orders module
│   └── notifications/  # Notifications module
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Database
- **Passport JWT** - Authentication
- **Class Validator** - DTO validation
- **Swagger** - API documentation

## License

MIT
