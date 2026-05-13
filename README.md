# OmniTenant SEO Engine

Programmatic SEO directory for IT companies in Indonesia, built as a portfolio-grade full-stack project for an Upwork profile focused on:

`Full-Stack Web Developer | SEO-Ready Sites & Workflow Automation`

This project demonstrates how to build a multi-tenant style business directory where each company gets its own SEO-friendly landing page with structured metadata, Open Graph support, JSON-LD, and static generation via Next.js App Router.

## Why This Project Exists

This repository is designed to be a stronger portfolio piece than a simple static company website.

It showcases:

- Full-stack routing with dynamic pages
- Database-backed content
- Programmatic SEO architecture
- ISR-ready page generation
- JSON-LD structured data
- Open Graph and metadata handling
- A migration path from local seed data to real business data

The long-term goal is to evolve this from a seeded prototype into a credible Indonesian IT company directory, starting with major cities in Java and then expanding by province across Indonesia.

## Current Status

The project is already functional as a prototype.

What is working now:

- Home page with branded landing experience
- City directory pages: `/companies/[city]`
- Company profile pages: `/companies/[city]/[slug]`
- Static path generation with `generateStaticParams()`
- ISR configuration using `revalidate = 86400`
- Dynamic metadata with page-specific titles and descriptions
- Open Graph metadata on detail pages
- JSON-LD `LocalBusiness` structured data on company pages
- Prisma integration with local SQLite for development
- Seeded example data for five cities in East Java

What is still prototype-level:

- Data is still seeded dummy data
- Database is still SQLite for local development
- Province filtering is not implemented yet
- No admin ingestion workflow yet
- No real verification pipeline for company records yet

## Tech Stack

- `Next.js 14` with App Router
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `Prisma 7`
- `SQLite` for local development
- `@prisma/adapter-better-sqlite3`
- `Lucide React`

## Architecture Summary

This is a programmatic SEO directory architecture:

- Home page introduces the directory and links into city hubs
- City pages act as SEO landing pages for keyword clusters like `perusahaan IT di Surabaya`
- Company detail pages act as long-tail landing pages like `pt-solusi-digital-surabaya`
- Content is fetched from Prisma-backed storage
- Static pages are generated ahead of time using `generateStaticParams()`
- Pages are revalidated every 24 hours using ISR

This makes the project strong for SEO and strong for portfolio storytelling because it combines content modeling, dynamic routing, and page-level search optimization.

## Route Map

- `/`
- `/companies/[city]`
- `/companies/[city]/[slug]`

Example routes:

- `/companies/surabaya`
- `/companies/malang`
- `/companies/surabaya/pt-solusi-digital-surabaya`

## SEO Features Already Implemented

### Metadata

The city and company pages generate metadata dynamically using Next.js `generateMetadata()`.

Already covered:

- Dynamic page titles
- Dynamic descriptions
- Canonical URLs
- Open Graph title and description
- Locale metadata
- Keyword arrays on company detail pages

### JSON-LD

Each company page renders `LocalBusiness` JSON-LD using [src/components/seo/JsonLd.tsx](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/src/components/seo/JsonLd.tsx).

Current schema includes:

- `@type: LocalBusiness`
- `name`
- `description`
- `url`
- `PostalAddress`
- `areaServed`
- `OfferCatalog`
- nested `Service` items

This has already been validated successfully in Schema.org testing based on your screenshots.

### ISR

Both city and company pages use:

```ts
export const revalidate = 86400;
```

That gives you a clean portfolio talking point:

`SEO landing pages are statically generated for speed, then refreshed in the background without rebuilding the entire site.`

## Database Model Right Now

Current Prisma model:

```prisma
model Company {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  city        String
  services    String
  description String
  logo_url    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([city])
  @@index([slug])
}
```

This is good enough for a prototype, but not enough for a production-quality Indonesian business directory.

## Recommended Next Evolution

To make this portfolio heavier and more believable, the project should move from seeded demo content to a real data workflow.

### Phase 1: Make the data model production-ready

Move away from the minimal `Company` model and support richer indexing fields.

Recommended additions:

- `province`
- `website`
- `email`
- `phone`
- `address`
- `foundedYear`
- `employeeCount`
- `pricingModel`
- `isVerified`
- `sourceName`
- `sourceUrl`
- `lastReviewedAt`
- `tags`
- `services` as normalized relation or `Json`
- `logoUrl`
- `linkedinUrl`
- `instagramUrl`

Strong recommendation:

- Switch from `services: String` to either Prisma `Json` or a normalized `Service` relation
- Add `province` immediately, because your future UX depends on province-first filtering

### Phase 2: Migrate to PostgreSQL

For a serious portfolio version, use PostgreSQL instead of SQLite.

Best target:

- `Supabase Postgres`

Why:

- Easy hosted Postgres
- Good DX
- Clean story for production deployment
- Friendly for Prisma

Recommended migration direction:

1. Update `datasource db` from `sqlite` to `postgresql`
2. Move `DATABASE_URL` to Supabase connection string
3. Regenerate Prisma client
4. Rebuild migration history for the new schema
5. Reseed using the improved dataset structure

### Phase 3: Real data ingestion

Start with real IT companies from major cities in Java:

- Jakarta
- Bandung
- Surabaya
- Semarang
- Yogyakarta
- Malang
- Solo
- Bekasi
- Tangerang
- Depok

Suggested sourcing approach:

- Company websites
- Google Maps listings
- Clutch profiles
- Tech in Asia directory references
- LinkedIn company pages
- Local business directories
- Startup and agency listing sites

Important rule for portfolio credibility:

- Never pretend uncertain data is verified
- Track every record source
- Add a visible `Verified` vs `Unverified` distinction later

### Phase 4: Province-first information architecture

This is the clean scaling path for Indonesia.

Recommended route expansion:

- `/companies`
- `/companies/[province]`
- `/companies/[province]/[city]`
- `/companies/[province]/[city]/[slug]`

That supports:

- Province landing pages
- City landing pages under province clusters
- Better topical authority
- Easier user filtering

### Phase 5: Filtering and search

For the next meaningful portfolio jump, add:

- Filter by province
- Filter by city
- Filter by service
- Filter by company type
- Search by keyword
- Sort by newest, verified, alphabetical

This is the point where the app starts to feel like a real product instead of a demo.

## Best Portfolio Story You Can Tell

This is the positioning angle I would use for Upwork and future case studies:

`Built a full-stack programmatic SEO directory for IT service companies using Next.js App Router, Prisma, and ISR. Implemented dynamic metadata, Open Graph, JSON-LD LocalBusiness schema, static city/company landing pages, and database-backed routing designed to scale from seeded content to real Indonesian business data.`

Stronger variant once the database is upgraded:

`Built an SEO-first multi-tenant style directory platform with ISR, structured data, dynamic route generation, and a Postgres-backed content pipeline for location-based landing pages.`

## Current Gaps To Fix Next

These are the most important technical next steps, in the correct order:

1. Normalize the schema for real data
2. Add `province` to the data model
3. Migrate from SQLite to PostgreSQL
4. Create a repeatable ingestion workflow for real companies
5. Add province and service filters
6. Replace dummy seed data with sourced records
7. Add a verification/source review layer

## Real Data Strategy

For your use case, the most realistic and efficient strategy is not full scraping first.

Start with a curated dataset:

1. Collect 20 to 50 real IT companies from major Java cities
2. Save source URLs for every record
3. Manually normalize names, cities, services, and descriptions
4. Import them into Postgres
5. Only after the schema is stable, automate enrichment

Why this is better:

- Faster to reach a believable portfolio state
- Lower legal and technical risk
- Easier to keep data quality high
- Better for AI-assisted continuation

## Suggested Future Schema Direction

You do not need to implement this immediately, but this is the shape I would move toward:

```prisma
model Company {
  id             Int       @id @default(autoincrement())
  name           String
  slug           String    @unique
  province       String
  city           String
  description    String
  website        String?
  email          String?
  phone          String?
  address        String?
  logoUrl        String?
  isVerified     Boolean   @default(false)
  sourceName     String?
  sourceUrl      String?
  lastReviewedAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([province])
  @@index([city])
  @@index([slug])
}
```

If services need filtering and analytics, use a relational table instead of a serialized string.

## Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed local database:

```bash
npm run db:seed
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check:

```bash
npx tsc --noEmit
```

## Notes About Development

- `npx tsc --noEmit` should not be run in parallel with `npm run build`, because `.next/types` can be regenerated during build
- If Next.js dev breaks on Windows because of `.next` chunk file issues, remove `.next` and start `npm run dev` again
- Prisma client is generated into `src/generated/prisma`

## Key Files

- [src/app/page.tsx](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/src/app/page.tsx)
- [src/app/companies/[city]/page.tsx](</c:/Users/MGTI251106/Downloads/Wafiy Anwarul/Projects/omni-tenant-seo-engine/src/app/companies/[city]/page.tsx>)
- [src/app/companies/[city]/[slug]/page.tsx](</c:/Users/MGTI251106/Downloads/Wafiy Anwarul/Projects/omni-tenant-seo-engine/src/app/companies/[city]/[slug]/page.tsx>)
- [src/components/seo/JsonLd.tsx](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/src/components/seo/JsonLd.tsx)
- [src/lib/prisma.ts](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/src/lib/prisma.ts)
- [prisma/schema.prisma](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/prisma/schema.prisma)
- [prisma/seed.ts](/c:/Users/MGTI251106/Downloads/Wafiy%20Anwarul/Projects/omni-tenant-seo-engine/prisma/seed.ts)

## AI Handoff Brief

Use this section when continuing with Gemini or Claude.

```text
Project: OmniTenant SEO Engine

Goal:
Turn this seeded Next.js + Prisma prototype into a credible portfolio-grade programmatic SEO directory for real IT companies in Indonesia.

Current state:
- Next.js 14 App Router
- Dynamic routes for city pages and company profile pages
- ISR enabled with revalidate = 86400
- Dynamic metadata implemented
- Open Graph implemented
- JSON-LD LocalBusiness implemented and validated
- Prisma 7 working locally with SQLite
- Dummy seeded company data for East Java

Immediate priorities:
1. Upgrade schema for real business records
2. Add province support
3. Migrate SQLite to PostgreSQL or Supabase
4. Design a clean ingestion workflow for real Indonesian IT company data
5. Add filters for province, city, and service

Constraints:
- Preserve existing ISR architecture
- Preserve existing SEO features
- Prefer scalable schema decisions over quick hacks
- Keep the project strong as an Upwork portfolio piece

Desired next output:
- Proposed improved Prisma schema
- Step-by-step migration plan to Postgres
- Data sourcing strategy for real IT companies in Indonesia
- Suggested implementation order that minimizes rework and token usage
```

## Final Direction

This project is already a solid prototype.

What will make it genuinely heavyweight as a portfolio piece is not just prettier UI, but this transition:

`dummy seeded SEO demo -> real-data SEO platform with scalable location taxonomy and production database design`

That is the jump that will make the work feel serious to clients.
