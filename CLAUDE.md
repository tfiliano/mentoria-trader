# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MENTORA AI is a multi-tenant SaaS platform for gamified trading mentorship. Built with Next.js 14+, Neon PostgreSQL, and NextAuth.js v5.

## Stack

- **Frontend**: Next.js 14+ (App Router, Server Components)
- **Backend**: Next.js API Routes + Server Actions
- **Database**: Neon PostgreSQL (serverless) + Drizzle ORM
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon database URL and auth secret

# Run database migrations
npm run db:push

# Seed initial data (creates mrthiagofx tenant)
npx tsx scripts/seed.ts

# Start development server
npm run dev
```

**Default login credentials (after seeding):**
- Tenant: `mrthiagofx`
- Email: `admin@mrthiagofx.com`
- Password: `Admin123!`

## Architecture

### Multi-Tenant Model

Every tenant (company) has isolated data:
- Users belong to ONE tenant
- All tables have `tenant_id` column
- Row-Level Security (RLS) policies in PostgreSQL
- Tenant context extracted from JWT session (never from client)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (dashboard)/        # Protected tenant dashboard
│   │   └── dashboard/
│   │       ├── page.tsx    # Dashboard home
│   │       ├── desafio/    # 30-day challenge
│   │       ├── ranking/    # Leaderboard
│   │       ├── perfil/     # User profile
│   │       ├── calculadoras/ # Trading calculators
│   │       └── admin/      # Tenant admin panel
│   ├── api/auth/           # NextAuth.js routes
│   └── layout.tsx          # Root layout
│
├── lib/
│   ├── db/
│   │   ├── schema.ts       # Drizzle ORM schema
│   │   ├── client.ts       # Neon connection
│   │   └── queries/        # Type-safe queries
│   ├── auth/
│   │   ├── config.ts       # NextAuth config
│   │   └── permissions.ts  # RBAC helpers
│   ├── gamification/       # Badges, levels, XP
│   └── utils/
│       ├── dto.ts          # Data sanitization
│       └── validation.ts   # Zod schemas
│
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── gamification/       # XP, badges, levels
│   ├── theme/              # Tenant theming
│   ├── admin/              # Admin components
│   └── providers/          # Context providers
│
├── hooks/                  # React hooks
├── types/                  # TypeScript types
└── middleware.ts           # Auth & tenant middleware
```

### Security Principles

1. **Tenant Isolation**: Every query filters by `tenant_id` from session
2. **Never Trust Client**: Tenant/user IDs come from JWT, not request body
3. **DTOs**: Internal fields (passwordHash, etc.) never exposed to client
4. **Server Actions**: Prefer over API routes for mutations

### Key Files

- `src/lib/auth/config.ts` - NextAuth configuration
- `src/lib/db/schema.ts` - Database schema (Drizzle ORM)
- `src/middleware.ts` - Auth and tenant middleware
- `src/lib/utils/dto.ts` - Data Transfer Objects
- `drizzle/0001_initial_schema.sql` - Database migration

### Gamification System

**Levels (1-10):**
Novato → Aprendiz → Praticante → Competente → Proficiente → Experiente → Avançado → Expert → Mestre → Lenda

**XP Thresholds:**
0 → 100 → 500 → 1500 → 3500 → 7500 → 15000 → 30000 → 50000 → 75000 → 100000

**XP Rewards:**
- Trade registered: 10 XP
- Winning trade: +20 XP (total 30 XP)
- Challenge day complete: 50 XP
- Challenge complete (30 days): 500 XP

### Design System

```css
--accent-primary: #00ff88;     /* Green - tenant customizable */
--accent-secondary: #00ccff;   /* Cyan - tenant customizable */
--accent-danger: #ff3366;
--purple: #6a4ff0;
--bg-primary: #0a0a0a;
--bg-secondary: #1a1a1a;
```

## Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

## Language

All user-facing content is in Portuguese (pt-BR).

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
AUTH_URL=http://localhost:3000
```
