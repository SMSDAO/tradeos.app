# Supabase Infrastructure

This directory contains all Supabase-related configurations, migrations, and edge functions.

## Directory Structure

```
infra/supabase/
├── migrations/          # SQL migration files
│   ├── 001_init.sql    # Initial schema (users, projects, tasks, messages)
│   └── 002_policies.sql # Row Level Security policies
├── functions/           # Edge functions (Deno runtime)
│   └── notify-on-new-message/
│       └── index.ts    # Notification webhook
└── seed/               # Seed data for development
    └── seed.sql        # Sample data
```

## Setup

### Prerequisites

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Local Development

1. Start local Supabase instance:
   ```bash
   cd infra/supabase
   supabase start
   ```

2. Apply migrations:
   ```bash
   supabase db reset  # Resets and applies all migrations
   ```

3. View local Studio:
   ```bash
   supabase studio
   ```

### Production Deployment

1. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Push migrations:
   ```bash
   supabase db push
   ```

3. Deploy edge functions:
   ```bash
   supabase functions deploy notify-on-new-message
   ```

## Migrations

### Creating New Migrations

```bash
supabase migration new migration_name
```

Edit the generated SQL file in `migrations/` directory.

### Running Migrations

Local:
```bash
supabase db reset
```

Production:
```bash
supabase db push
```

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to read/write their own data
- Allow admins full access
- Enforce project membership for projects and tasks
- Protect sensitive operations

**Important**: Review and test all RLS policies before deploying to production.

## Edge Functions

### notify-on-new-message

Triggered when a new message is created. Currently a stub implementation.

**To implement**:
1. Add push notification service (FCM/APNs)
2. Configure email notifications
3. Set up webhook endpoints
4. Add rate limiting

**Deploy**:
```bash
supabase functions deploy notify-on-new-message
```

**Test locally**:
```bash
supabase functions serve notify-on-new-message
```

## Security Considerations

### Environment Variables

Never commit these to version control:
- `SUPABASE_SERVICE_ROLE_KEY` - Bypasses RLS, server-only
- Database passwords
- API keys for external services

### Best Practices

1. **Always use RLS**: Every table should have RLS enabled
2. **Test policies**: Verify policies work as expected for all roles
3. **Input validation**: Validate data on both client and server
4. **Rate limiting**: Implement rate limits on edge functions
5. **Audit logs**: Consider logging sensitive operations
6. **Prepared statements**: Use parameterized queries to prevent SQL injection

### RLS Policy Testing

Test policies using Supabase's SQL editor:

```sql
-- Test as a specific user
SELECT auth.uid();  -- Check current user
SET request.jwt.claims.sub = 'user-uuid-here';

-- Test queries
SELECT * FROM projects;  -- Should only return user's projects
```

## Database Schema

### Tables

- **users**: User profiles extending Supabase Auth
- **projects**: Project management
- **tasks**: Task tracking within projects
- **messages**: Chat messages with file support
- **project_members**: Project membership junction table

### Relationships

```
users (1) → (*) projects (owner_id)
projects (1) → (*) tasks (project_id)
users (1) → (*) tasks (assignee_id)
users (1) → (*) messages (user_id)
projects (*) ↔ (*) users (via project_members)
```

## CI/CD Integration

See `.github/workflows/supabase-migrations.yml` for automated migration deployment on merge to main.

## Troubleshooting

### Common Issues

1. **Migration conflicts**: Reset local DB with `supabase db reset`
2. **RLS blocking queries**: Check policies and current user context
3. **Edge function errors**: Check logs with `supabase functions logs`

### Useful Commands

```bash
# View migration status
supabase migration list

# Generate TypeScript types from schema
supabase gen types typescript --local > types/database.ts

# View logs
supabase logs

# Reset local database
supabase db reset
```

## Next Steps

1. Customize RLS policies for your use case
2. Implement notification service in edge function
3. Add storage buckets for file uploads
4. Configure OAuth providers in Supabase dashboard
5. Set up database backups
6. Configure custom domains
7. Add monitoring and alerts
