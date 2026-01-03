# TradeOS Monorepo - Next Steps & Known Limitations

This document outlines the next steps for implementing business logic and known limitations of the scaffold.

## ✅ What's Implemented

### Complete Monorepo Structure
- ✅ Turborepo + pnpm workspaces configuration
- ✅ Three primary apps: web-admin, mobile, shared package
- ✅ Supabase infrastructure (migrations, RLS policies, edge functions)
- ✅ CI/CD workflows (GitHub Actions)
- ✅ Automation scripts (setup.sh, install.sh, master.sh)
- ✅ Comprehensive documentation

### Security & Best Practices
- ✅ .env.example with all required placeholders
- ✅ RLS policies for users, projects, tasks, messages
- ✅ Security documentation and warnings
- ✅ No secrets committed

### Developer Experience
- ✅ TypeScript throughout
- ✅ ESLint + Prettier configuration
- ✅ Jest testing infrastructure
- ✅ Hot reload for web and mobile
- ✅ Issue and PR templates

## 🚧 Next Steps to Complete

### 1. Install Dependencies (Required First)

```bash
# Install pnpm if not already installed
npm install -g pnpm@9

# Bootstrap the monorepo
./setup.sh
# or manually:
pnpm install
```

**Expected Output:**
- All dependencies installed
- `.env.local` created from `.env.example`
- Shared package built

### 2. Configure Supabase (Critical)

1. **Create Supabase Project**: https://app.supabase.com
2. **Get Credentials** (Project Settings > API):
   - Project URL
   - Anon Key
   - Service Role Key (NEVER commit this!)
3. **Update `.env.local`** with actual values
4. **Apply Migrations**:
   ```bash
   cd infra/supabase
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   cd ../..
   ```

### 3. Set Up GitHub Secrets (For CI/CD)

Navigate to: Repository Settings > Secrets and variables > Actions

**Required Secrets:**

```yaml
# Supabase
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
SUPABASE_DB_PASSWORD

# Vercel (for web-admin deployment)
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Expo (for mobile builds)
EXPO_TOKEN  # or EAS_TOKEN
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Implement Business Logic

#### Web Admin (`apps/web-admin/`)

**Priority 1 - Authentication:**
- [ ] Create login page: `app/login/page.tsx`
- [ ] Implement sign-in flow using Supabase Auth
- [ ] Add protected route middleware
- [ ] Create user profile page

**Priority 2 - User Management:**
- [ ] Fetch users from database in `app/admin/users/page.tsx`
- [ ] Implement user list with search/filter
- [ ] Add user edit/suspend/delete actions
- [ ] Role management (admin/user toggle)

**Priority 3 - Analytics:**
- [ ] Connect to Supabase for real metrics
- [ ] Add charts (consider recharts library)
- [ ] Real-time updates using Supabase Realtime
- [ ] Export functionality

**Priority 4 - Other Pages:**
- [ ] Moderation queue with flagged content
- [ ] Projects CRUD operations
- [ ] Settings page for platform configuration

#### Mobile App (`apps/mobile/`)

**Priority 1 - Authentication:**
- [ ] Create login/signup screens
- [ ] Integrate Supabase Auth (email + OAuth)
- [ ] Store auth tokens securely
- [ ] Protected navigation

**Priority 2 - Core Features:**
- [ ] Home screen with realtime data
- [ ] Projects list with pull-to-refresh
- [ ] Task management UI
- [ ] Chat interface with file uploads

**Priority 3 - Polish:**
- [ ] Replace placeholder assets with real icons
- [ ] Add loading states and error handling
- [ ] Implement offline support
- [ ] Push notifications (using Expo Notifications)

#### Shared Package (`packages/shared/`)

**Additions Needed:**
- [ ] Add more reusable UI components
- [ ] API client wrappers
- [ ] Common utility functions
- [ ] Validation schemas (consider Zod)

### 5. Configure OAuth Providers

In Supabase Dashboard > Authentication > Providers:

**Google OAuth:**
1. Create OAuth credentials in Google Cloud Console
2. Add redirect URLs
3. Configure in Supabase

**GitHub OAuth:**
1. Create OAuth App in GitHub Settings
2. Add callback URL
3. Configure in Supabase

### 6. Set Up Storage Buckets (For File Uploads)

In Supabase Dashboard > Storage:

1. **Create buckets:**
   - `avatars` (public)
   - `message-attachments` (private)
   - `project-files` (private)

2. **Configure RLS policies** for each bucket

3. **Update code** to use storage API

### 7. Production Deployment

#### Web Admin to Vercel

**Option A - GitHub Actions (Recommended):**
- Push to `main` branch
- Automatic deployment via workflow

**Option B - Manual:**
```bash
cd apps/web-admin
vercel --prod
```

#### Mobile to App Stores

**1. Configure EAS:**
```bash
cd apps/mobile
eas login
eas build:configure
```

**2. Update app.json:**
- Set real bundle identifiers
- Update app name and description
- Add real icon and splash screen

**3. Build:**
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

**4. Submit:**
```bash
eas submit --platform ios
eas submit --platform android
```

#### Supabase Migrations

**Automatic (on push to main):**
- Workflow applies migrations automatically

**Manual:**
```bash
supabase db push
```

## ⚠️ Known Limitations

### 1. Placeholder Content
- **Mobile assets**: Need real PNG files (icon.png, splash.png, etc.)
- **Sample data**: Seed data is for development only
- **Edge function**: Notification logic is stub implementation

### 2. Missing Business Logic
- **Authentication flows**: Login/signup UI exists as placeholders
- **CRUD operations**: API calls not wired up
- **Real-time features**: Subscriptions need to be implemented
- **File uploads**: Storage integration incomplete

### 3. Testing
- **Unit tests**: Only placeholder test exists
- **Integration tests**: Not implemented
- **E2E tests**: Not set up
- **RLS policy tests**: Need manual verification

### 4. Security Hardening
- **Rate limiting**: Not implemented in edge functions
- **Input validation**: Basic validation missing
- **CORS**: May need adjustment for production
- **CSP headers**: Not configured

### 5. Performance
- **Image optimization**: Next.js Image component not used everywhere
- **Code splitting**: Can be improved
- **Bundle size**: Not optimized
- **Caching**: Redis/CDN not configured

### 6. Mobile Specific
- **Splash screen**: Default Expo splash
- **App icons**: Placeholder text files
- **Deep linking**: Not configured
- **Push notifications**: Setup incomplete

### 7. Monitoring & Observability
- **Error tracking**: Sentry not integrated
- **Analytics**: Google Analytics not added
- **Logging**: Production logging not configured
- **Alerting**: No monitoring alerts

## 📋 Recommended Order of Implementation

1. **Week 1: Foundation**
   - Install dependencies
   - Configure Supabase
   - Apply migrations
   - Set up GitHub Secrets

2. **Week 2: Authentication**
   - Implement login/signup (web + mobile)
   - Protected routes
   - User profile management

3. **Week 3: Core Features**
   - User management (admin)
   - Projects CRUD
   - Tasks management
   - Basic chat

4. **Week 4: Realtime & Storage**
   - Supabase Realtime integration
   - File uploads
   - Notifications

5. **Week 5: Polish & Testing**
   - Error handling
   - Loading states
   - Unit tests
   - Integration tests

6. **Week 6: Deployment**
   - Deploy web-admin to Vercel
   - Build mobile apps with EAS
   - Set up monitoring
   - Final testing

## 🔧 Troubleshooting Common Issues

### Dependencies won't install
```bash
# Clear all node_modules
pnpm clean
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

### Turborepo build fails
```bash
# Build shared package first
pnpm turbo run build --filter=shared

# Then build everything else
pnpm build
```

### Mobile app won't start
```bash
cd apps/mobile
rm -rf .expo node_modules
pnpm install
pnpm dev
```

### Supabase migrations fail
```bash
# Reset local database
supabase db reset

# Check migration status
supabase migration list

# Apply specific migration
supabase db push
```

## 📚 Additional Resources

- **Turborepo**: https://turbo.build/repo/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Supabase Realtime**: https://supabase.com/docs/guides/realtime
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Vercel Deployment**: https://vercel.com/docs

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/SMSDAO/tradeos.app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SMSDAO/tradeos.app/discussions)

---

**Last Updated**: 2026-01-03
