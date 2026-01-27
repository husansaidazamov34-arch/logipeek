# ✅ Ro'yxatdan O'tish Yangilandi

## Nima O'zgardi?

### Haydovchi uchun yangi maydonlar qo'shildi:

1. **Avtomobil turi** (dropdown)
   - Yuk mashinasi
   - Katta yuk
   - Yengil yuk
   - Furgon

2. **Avtomobil modeli** (text input)
   - Misol: Isuzu NPR 75

3. **Avtomobil raqami** (text input)
   - Misol: 01 A 777 BA
   - Avtomatik katta harfga o'tkaziladi

4. **Haydovchilik guvohnomasi** (text input)
   - Misol: DL123456789

### Yuk beruvchi uchun yangi maydonlar (ixtiyoriy):

1. **Kompaniya nomi** (text input)
   - Misol: SardorTrade LLC
   - Ixtiyoriy

2. **Kompaniya manzili** (text input)
   - Misol: Tashkent, Chilanzar
   - Ixtiyoriy

## Qanday Ishlaydi?

### 1. Rol Tanlash
```
┌─────────────────────────────────┐
│  [Haydovchi]  [Yuk beruvchi]    │
└─────────────────────────────────┘
```

### 2. Haydovchi Tanlansa
```
Umumiy maydonlar:
├── To'liq ism
├── Email
├── Telefon
└── Parol

Avtomobil ma'lumotlari:
├── Avtomobil turi (dropdown)
├── Avtomobil modeli
├── Avtomobil raqami
└── Haydovchilik guvohnomasi
```

### 3. Yuk Beruvchi Tanlansa
```
Umumiy maydonlar:
├── To'liq ism
├── Email
├── Telefon
└── Parol

Kompaniya ma'lumotlari (ixtiyoriy):
├── Kompaniya nomi
└── Kompaniya manzili
```

## Validatsiya

### Haydovchi uchun:
- ✅ Barcha maydonlar majburiy
- ✅ Avtomobil turi tanlanishi kerak
- ✅ Avtomobil modeli kiritilishi kerak
- ✅ Avtomobil raqami kiritilishi kerak
- ✅ Haydovchilik guvohnomasi kiritilishi kerak

### Yuk beruvchi uchun:
- ✅ Faqat umumiy maydonlar majburiy
- ✅ Kompaniya ma'lumotlari ixtiyoriy

## UI/UX Xususiyatlari

### 1. Dinamik Maydonlar
- Rol o'zgarganda maydonlar animatsiya bilan ko'rinadi/yashirinadi
- Framer Motion animatsiyalari

### 2. Input Formatlash
- Avtomobil raqami avtomatik katta harfga o'tkaziladi
- Telefon raqam +998 formatida

### 3. Xato Xabarlari
- Agar haydovchi barcha maydonlarni to'ldirmasa: "Haydovchi uchun barcha maydonlarni to'ldiring"
- Backend xatolari toast notification bilan ko'rsatiladi

## Backend Integration

### API Endpoint
```
POST /api/v1/auth/register
```

### Request Body (Haydovchi)
```json
{
  "email": "driver@test.com",
  "password": "password123",
  "fullName": "Javohir Karimov",
  "phone": "+998901234567",
  "role": "driver",
  "vehicleType": "Yuk mashinasi",
  "vehicleModel": "Isuzu NPR 75",
  "licensePlate": "01 A 777 BA",
  "licenseNumber": "DL123456789"
}
```

### Request Body (Yuk beruvchi)
```json
{
  "email": "shipper@test.com",
  "password": "password123",
  "fullName": "Sardor Rahimov",
  "phone": "+998901234568",
  "role": "shipper",
  "companyName": "SardorTrade LLC",
  "companyAddress": "Tashkent, Chilanzar"
}
```

## Test Qilish

### Haydovchi Ro'yxatdan O'tish:

1. `/register` sahifasiga o'ting
2. "Haydovchi" ni tanlang
3. Umumiy ma'lumotlarni kiriting:
   - To'liq ism: Javohir Karimov
   - Email: test@driver.com
   - Telefon: +998901234567
   - Parol: password123

4. Avtomobil ma'lumotlarini kiriting:
   - Avtomobil turi: Yuk mashinasi
   - Avtomobil modeli: Isuzu NPR 75
   - Avtomobil raqami: 01 A 777 BA
   - Haydovchilik guvohnomasi: DL123456789

5. "Ro'yxatdan o'tish" tugmasini bosing
6. ✅ Muvaffaqiyatli ro'yxatdan o'tasiz va dashboard ga yo'naltirilasiz

### Yuk Beruvchi Ro'yxatdan O'tish:

1. `/register` sahifasiga o'ting
2. "Yuk beruvchi" ni tanlang
3. Umumiy ma'lumotlarni kiriting
4. Kompaniya ma'lumotlarini kiriting (ixtiyoriy)
5. "Ro'yxatdan o'tish" tugmasini bosing
6. ✅ Muvaffaqiyatli ro'yxatdan o'tasiz

## Fayl O'zgarishlari

### Frontend:
1. **logipeek_frontend/src/pages/Register.tsx**
   - Yangi maydonlar qo'shildi
   - Dinamik form (rol asosida)
   - Validatsiya qo'shildi
   - Animatsiyalar qo'shildi

2. **logipeek_frontend/src/contexts/AuthContext.tsx**
   - RegisterData interface yangilandi
   - Yangi maydonlar qo'shildi

### Backend:
- ✅ Backend allaqachon tayyor edi
- ✅ RegisterDto barcha maydonlarni qabul qiladi
- ✅ AuthService driver va shipper profile yaratadi

## ✅ Tayyor!

Endi haydovchilar ro'yxatdan o'tayotganda avtomobil ma'lumotlarini kiritishlari shart!
