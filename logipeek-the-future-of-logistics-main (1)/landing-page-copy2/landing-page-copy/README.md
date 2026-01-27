# LogiPeek Landing Page - To'liq Paket 🚀

Bu papkada LogiPeek loyihasining landing page'i **TO'LIQ ISHLAYDIGAN** holatda nusxalangan.

## 📦 Paket tarkibi:

### 🎨 Landing Page Komponentlari:
1. **landing-page.tsx** - Asosiy landing page komponenti
2. **navbar.tsx** - Navigatsiya paneli (3 til, mobil menu)
3. **hero-section.tsx** - Hero bo'limi (animatsiyalar bilan)
4. **stats-section.tsx** - Statistika (500+ haydovchilar, 1200+ buyurtmalar)
5. **features-section.tsx** - Xususiyatlar (Fraud protection, GPS, etc)
6. **how-it-works-section.tsx** - Qanday ishlaydi (Yuk egasi va Haydovchi)
7. **security-section.tsx** - Xavfsizlik kafolatlari
8. **cta-section.tsx** - Call-to-Action bo'limi
9. **location-section.tsx** - Joylashuv va xarita
10. **contact-section.tsx** - Aloqa formasi
11. **footer.tsx** - Footer (ijtimoiy tarmoqlar bilan)

### 🔧 Kerakli Fayllar (HAMMASI BOR):
- **contexts/settings-context.tsx** - Til va sozlamalar
- **hooks/use-geolocation.ts** - GPS joylashuv hook
- **components/icons/logistics-icons.tsx** - Maxsus ikonkalar
- **lib/** - Barcha utility funksiyalar (i18n, utils, etc)
- **assets/** - Barcha rasmlar (16 ta rasm)

## 🚀 Boshqa loyihaga qo'shish:

### 1-qadam: Fayllarni ko'chirish

```bash
# Landing page komponentlarini ko'chirish
cp landing-page-copy/*.tsx your-project/components/landing/

# Contexts va hooks
cp -r landing-page-copy/contexts your-project/
cp -r landing-page-copy/hooks your-project/

# Icons va lib
cp -r landing-page-copy/components your-project/
cp -r landing-page-copy/lib your-project/

# Rasmlar
cp -r landing-page-copy/assets your-project/public/
```

### 2-qadam: Package.json ga qo'shish

```bash
npm install framer-motion lucide-react sonner
npm install @radix-ui/react-label @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
npm install leaflet react-leaflet  # Xarita uchun
npm install @types/leaflet --save-dev
```

### 3-qadam: Tailwind CSS sozlash

`tailwind.config.ts` faylingizga qo'shing:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... qolgan ranglar
      },
    },
  },
}
```

### 4-qadam: CSS Variables

`globals.css` ga qo'shing:

```css
@layer base {
  :root {
    --primary: 142 76% 36%;
    --primary-foreground: 0 0% 100%;
    /* ... qolgan o'zgaruvchilar */
  }
}

.btn-tesla {
  @apply bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300;
}

.glass {
  @apply bg-white/80 backdrop-blur-md;
}

.premium-card {
  @apply bg-white rounded-xl border border-gray-100 shadow-sm;
}
```

### 5-qadam: Landing Page'ni ishlatish

```tsx
// app/page.tsx yoki boshqa sahifada
import { LandingPage } from "@/components/landing/landing-page"

export default function HomePage() {
  return <LandingPage />
}
```

## 🎯 Kerakli UI Komponentlar:

Agar sizda Shadcn UI bo'lmasa, quyidagilarni o'rnating:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
```

## 📸 Rasmlar:

Barcha rasmlar `assets/` papkasida:
- ✅ logistics-hero-main.png (Hero background)
- ✅ logistics-tracking.png (Features background)
- ✅ logistics-mobile.png (Security section)
- ✅ Va boshqalar...

## 🌍 Tillar:

3 til qo'llab-quvvatlanadi:
- 🇺🇿 O'zbek (uz)
- 🇷🇺 Rus (ru)
- 🇬🇧 Ingliz (en)

Barcha tarjimalar `lib/i18n.ts` da mavjud.

## ✨ Xususiyatlar:

- ✅ To'liq responsive (mobil, planshet, desktop)
- ✅ Framer Motion animatsiyalari
- ✅ GPS joylashuv aniqlash
- ✅ 3 til (O'zbek, Rus, Ingliz)
- ✅ Dark/Light mode tayyor
- ✅ Leaflet xarita integratsiyasi
- ✅ Contact forma
- ✅ Social media links
- ✅ SEO optimized

## 🔗 Import yo'llari:

Agar import yo'llari ishlamasa, `tsconfig.json` da tekshiring:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🆘 Yordam:

Agar muammo bo'lsa:
1. Node modules o'rnatilganini tekshiring
2. Tailwind CSS to'g'ri sozlanganini tekshiring
3. Import yo'llari to'g'ri ekanini tekshiring
4. Rasmlar `public/assets/` da ekanini tekshiring

## 📞 Aloqa:

- Telegram: @logipeek_logistika
- Email: info@logipeek.uz
- Phone: +998 90 449 08 90

---

**Eslatma:** Bu to'liq ishlaydigan landing page. Faqat ko'chirib, package'larni o'rnatib, ishlatishingiz mumkin! 🎉
