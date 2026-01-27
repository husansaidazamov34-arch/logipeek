# 🔔 Bildirishnomalar Qo'llanma

## Bildirishnomalar Tugmasi Qayerda?

### Driver Dashboard
```
┌─────────────────────────────────────────────┐
│  LogiPeek                    [🔔] [👤]      │  ← Bell icon bu yerda
└─────────────────────────────────────────────┘
```

### Shipper Dashboard
```
┌─────────────────────────────────────────────┐
│  LogiPeek                    [🔔] [👤]      │  ← Bell icon bu yerda
└─────────────────────────────────────────────┘
```

## Qanday Ishlaydi?

### 1. Bell Icon
- Profil tugmasi yonida joylashgan
- O'qilmagan bildirishnomalar soni ko'rsatiladi (qizil badge)
- Misol: `[🔔 3]` - 3 ta o'qilmagan

### 2. Dropdown Ochish
- Bell icon ustiga bosing
- Dropdown pastga ochiladi
- Animatsiya bilan smooth ochiladi

### 3. Bildirishnomalar Ro'yxati
```
┌─────────────────────────────────────────┐
│ Bildirishnomalar          Barchasini    │
│ 2 ta o'qilmagan          o'qilgan       │
├─────────────────────────────────────────┤
│ 📦 Yangi buyurtma              [✓]      │
│    Tashkent - Samarkand...              │
│    14 Yan, 14:30                        │
├─────────────────────────────────────────┤
│ 🚚 Yetkazib berish tasdiqlandi [✓]     │
│    Buyurtma #ORD-100...                 │
│    14 Yan, 13:30                        │
├─────────────────────────────────────────┤
│ ⚠️ To'lov qabul qilindi                 │
│    450,000 so'm...                      │
│    14 Yan, 12:30                        │
├─────────────────────────────────────────┤
│              Yopish                     │
└─────────────────────────────────────────┘
```

### 4. Bildirishnoma Turlari

| Icon | Tur | Rang | Misol |
|------|-----|------|-------|
| 📦 | order | Primary | Yangi buyurtma |
| 🚚 | shipment | Accent | Yetkazib berish |
| ⚠️ | alert | Warning | To'lov, ogohlantirish |

### 5. Amallar

#### O'qilgan deb belgilash
- Har bir bildirishnoma yonida `[✓]` tugmasi
- Bosilganda bildirishnoma o'qilgan bo'ladi
- Badge soni kamayadi

#### Barchasini o'qilgan
- Yuqori o'ng burchakda tugma
- Barcha bildirishnomalarni bir vaqtda o'qilgan qiladi
- Badge yo'qoladi

## Mock Data (Test uchun)

Agar backend bo'sh bo'lsa, avtomatik 3 ta test bildirishnoma ko'rsatiladi:

1. **Yangi buyurtma** (o'qilmagan)
   - Tashkent - Samarkand yo'nalishi
   - Hozir

2. **Yetkazib berish tasdiqlandi** (o'qilmagan)
   - Buyurtma #ORD-100
   - 1 soat oldin

3. **To'lov qabul qilindi** (o'qilgan)
   - 450,000 so'm
   - 2 soat oldin

## Texnik Ma'lumotlar

### API Endpoints
```
GET  /api/v1/notifications              → Barcha bildirishnomalar
GET  /api/v1/notifications/unread-count → O'qilmagan soni
PUT  /api/v1/notifications/:id/read     → Bitta o'qilgan
PUT  /api/v1/notifications/read-all     → Barchasi o'qilgan
```

### Hooks
```typescript
useNotifications()      // Barcha bildirishnomalar
useUnreadCount()        // O'qilmagan soni
useMarkAsRead()         // Bitta o'qilgan
useMarkAllAsRead()      // Barchasi o'qilgan
```

## Muammolarni Hal Qilish

### Bell icon ko'rinmayapti?
- Sahifani yangilang (F5)
- Login qiling (driver@test.com yoki shipper@test.com)
- Browser console ni tekshiring

### Bildirishnomalar bo'sh?
- Bu normal! Backend hali bildirishnoma yaratmagan
- Mock data avtomatik ko'rsatiladi
- 3 ta test bildirishnoma ko'rinishi kerak

### Badge ko'rinmayapti?
- Barcha bildirishnomalar o'qilgan bo'lsa badge yo'q
- Mock data da 2 ta o'qilmagan bor
- Badge: `[🔔 2]`

## Test Qilish

1. **Login qiling**
   ```
   Email: driver@test.com
   Password: password123
   ```

2. **Bell icon toping**
   - Yuqori o'ng burchak
   - Profil yonida

3. **Bosing va tekshiring**
   - Dropdown ochilishi kerak
   - 3 ta bildirishnoma ko'rinishi kerak
   - 2 ta o'qilmagan (badge: 2)

4. **O'qilgan deb belgilang**
   - [✓] tugmasini bosing
   - Badge 1 ga tushishi kerak

5. **Barchasini o'qilgan**
   - "Barchasini o'qilgan" tugmasini bosing
   - Badge yo'qolishi kerak

## ✅ Tayyor!

Bildirishnomalar to'liq ishlaydi va test qilishga tayyor!
