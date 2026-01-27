# 📦 O'rnatish Yo'riqnomasi

## 1. Package'larni o'rnatish

```bash
# Asosiy kutubxonalar
npm install framer-motion lucide-react sonner

# Radix UI komponentlar
npm install @radix-ui/react-label @radix-ui/react-slot

# Utility kutubxonalar
npm install class-variance-authority clsx tailwind-merge

# Xarita uchun (ixtiyoriy)
npm install leaflet react-leaflet
npm install @types/leaflet --save-dev

# Next.js Image uchun
npm install next
```

## 2. Fayllarni ko'chirish

```bash
# Agar siz Linux/Mac da bo'lsangiz:
cd landing-page-copy

# Komponentlarni ko'chirish
cp *.tsx ../your-project/components/landing/

# Contexts
cp -r contexts ../your-project/

# Hooks
cp -r hooks ../your-project/

# Icons
cp -r components/icons ../your-project/components/

# Lib
cp -r lib ../your-project/

# Rasmlar
cp -r assets ../your-project/public/
```

## 3. Tailwind CSS sozlash

`tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
export default config
```

## 4. CSS Variables

`app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 142 76% 36%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 142 76% 36%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 142 76% 36%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 142 76% 36%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom classes */
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

## 5. TypeScript Config

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 6. Next.js Config

`next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
}

export default nextConfig
```

## 7. Ishlatish

```tsx
// app/page.tsx
import { LandingPage } from "@/components/landing/landing-page"

export default function HomePage() {
  return <LandingPage />
}
```

## 8. Provider'larni qo'shish

`app/layout.tsx`:

```tsx
import { SettingsProvider } from "@/contexts/settings-context"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>
        <SettingsProvider>
          {children}
          <Toaster position="top-right" />
        </SettingsProvider>
      </body>
    </html>
  )
}
```

## ✅ Tayyor!

Endi `npm run dev` buyrug'i bilan ishga tushiring va `http://localhost:3000` da ko'ring!
