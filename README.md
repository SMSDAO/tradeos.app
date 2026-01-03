# TradeOS - Production-Ready Monorepo

<div align="center">

![TradeOS](https://img.shields.io/badge/TradeOS-2026-blue)
![License](https://img.shields.io/badge/license-Apache--2.0-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange)

A modern, production-ready monorepo built with Expo (React Native), Next.js, and Supabase.

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Deployment](#deployment) • [Security](#security)

</div>

---

## 🚀 Features

### 🏗️ Monorepo Architecture
- **Turborepo** for optimized build caching and task orchestration
- **pnpm** workspaces for efficient dependency management
- **Shared packages** for code reuse across web and mobile

### 📱 Mobile Application (Expo + React Native)
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Supabase integration** for auth and realtime data
- **EAS Build** ready for App Store and Play Store deployment

### 🌐 Web Admin (Next.js App Router)
- **Next.js 15** with App Router and React Server Components
- **Shadcn/UI + Tailwind CSS** for beautiful, accessible components
- **TypeScript** throughout
- **Supabase SSR** for server-side auth

### 🗄️ Backend (Supabase)
- **PostgreSQL** database with migrations
- **Row Level Security (RLS)** policies for data protection
- **Realtime subscriptions** for live updates
- **Edge Functions** for serverless compute
- **Storage** for file uploads
- **Email & OAuth** authentication (Google, GitHub)

### 🔒 Security First
- Example RLS policies with admin and user roles
- Environment variable templates (`.env.example`)
- Never commit secrets - GitHub Secrets for CI/CD
- Input validation on client and server

### 🤖 CI/CD & Automation
- **GitHub Actions** workflows for:
  - Continuous Integration (lint, test, typecheck)
  - Vercel deployment for web-admin
  - EAS builds for mobile
  - Supabase migrations on merge

### 🛠️ Developer Experience
- One-command setup with `./setup.sh`
- Parallel dev server with `./master.sh`
- Hot reload for web and mobile
- TypeScript across the stack

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0
- **Supabase CLI** (optional, for local dev)
- **Expo CLI** (for mobile development)
- **Git**

Not installed? Run `./install.sh` for installation guidance.

### 1. Clone the Repository

```bash
git clone https://github.com/SMSDAO/tradeos.app.git
cd tradeos.app
```

### 2. Run Setup

```bash
./setup.sh
```

This will:
- Install all dependencies
- Create `.env.local` from `.env.example`
- Initialize Supabase (if CLI is installed)
- Build shared packages

### 3. Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```bash
# Get these from https://app.supabase.com (Project Settings > API)
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEVER COMMIT THIS - Server-only, bypasses RLS
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Apply Database Migrations

```bash
cd infra/supabase
supabase db reset  # or supabase db push for production
cd ../..
```

### 5. Start Development

```bash
./master.sh
# or
pnpm dev
```

Visit:
- **Web Admin**: http://localhost:3000
- **Mobile (Expo)**: Scan QR code with Expo Go app

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     TradeOS Platform                     │
├─────────────────────┬───────────────────┬───────────────┤
│   Mobile (Expo)     │   Web (Next.js)   │   Supabase    │
│   React Native      │   App Router      │   PostgreSQL  │
│   TypeScript        │   TypeScript      │   Realtime    │
│                     │                   │   Auth        │
│   Apps/mobile/      │   Apps/web-admin/ │   Edge Fns    │
└─────────────────────┴───────────────────┴───────────────┘
                          │
                    ┌─────┴─────┐
                    │  Shared   │
                    │  Package  │
                    │ packages/ │
                    └───────────┘
```

---

## 📁 Project Structure

```
tradeos.app/
├── apps/
│   ├── web-admin/              # Next.js admin dashboard
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Supabase client, utils
│   │   └── package.json
│   │
│   └── mobile/                 # Expo mobile app
│       ├── app/                # Expo Router screens
│       ├── components/         # React Native components
│       ├── hooks/              # Custom hooks
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared code
│       └── src/
│           ├── hooks/          # Shared hooks
│           ├── types/          # TypeScript types
│           └── utils/          # Utility functions
│
├── infra/
│   └── supabase/               # Database & backend
│       ├── migrations/         # SQL migrations
│       ├── functions/          # Edge functions
│       └── seed/               # Seed data
│
├── .github/workflows/          # CI/CD pipelines
├── setup.sh                    # One-command setup
├── install.sh                  # Dependency installation guide
├── master.sh                   # Run all dev servers
└── .env.example                # Environment template
```

---

## 🚢 Deployment

### Web Admin (Vercel)

Push to `main` branch for automatic deployment.

**Required Secrets**:
- `VERCEL_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Mobile (EAS)

```bash
cd apps/mobile
eas build --platform all --profile production
```

**Required Secrets**:
- `EXPO_TOKEN`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Migrations

```bash
cd infra/supabase
supabase db push
```

---

## 🔒 Security

### ⚠️ Critical Security Rules

1. **NEVER commit secrets** to git
2. **Row Level Security (RLS)** - All tables have RLS enabled
3. **Input Validation** - Validate on client AND server
4. **Rate Limiting** - Implement on edge functions
5. **HTTPS Everywhere** - Enforce HTTPS in production

### Environment Variables Safety

```bash
# ✅ Safe for client-side
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY

# ❌ NEVER expose to client - server-only
SUPABASE_SERVICE_ROLE_KEY
```

---

## 📱 App Store Submission

### iOS

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Android

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## 🐛 Troubleshooting

### Common Issues

#### `pnpm not found`
```bash
npm install -g pnpm
```

#### Migration conflicts
```bash
cd infra/supabase
supabase db reset
```

#### Build errors
```bash
pnpm clean
pnpm bootstrap
```

---

## 📚 Resources

- [Turborepo](https://turbo.build/repo/docs)
- [Next.js](https://nextjs.org/docs)
- [Expo](https://docs.expo.dev/)
- [Supabase](https://supabase.com/docs)

---

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) file.

---

<div align="center">

Made with ❤️ by the TradeOS team

</div>
