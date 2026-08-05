# Go Links

A small internal URL-shortcut service built as an interview-ready first iteration. Teams create memorable paths such as `go/design-system`, search the shared directory, copy links, and follow redirects. Visits are counted atomically.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Useful checks:

```bash
npm test
npm run lint
npm run build
```

## Architecture

- `src/app` owns pages and thin HTTP route handlers.
- `src/components` contains feature components and small shadcn-style UI primitives.
- `src/lib/links.ts` is the application/data boundary, keeping Prisma out of presentation code.
- `src/lib/validation` is the shared Zod contract used by both React Hook Form and the API.
- `prisma` contains the SQLite schema, migrations, and representative seed data.

The API exposes `GET /api/links` and `POST /api/links`. `GET /go/:slug` atomically increments the visit count and redirects. Mutation responses include a request ID, and unexpected failures are logged with that ID for correlation.

## Assumptions and tradeoffs

- This is an authenticated-company-network product, so identity and authorization are intentionally out of scope for the first hour. The schema is ready to gain ownership fields later.
- Slugs are lowercase, kebab-case, and unique. Only HTTP(S) destinations are accepted to avoid dangerous protocols.
- Search is client-side because the expected first-iteration dataset is small. Server-side pagination/search should replace it as usage grows.
- SQLite keeps local setup nearly frictionless. A production deployment with multiple app instances should move to managed Postgres.
- Visit counts are useful lightweight feedback, not analytics-grade data. Counting in the redirect write adds latency but gives simple, consistent semantics.

## With another day

I would add SSO and role-based editing, owners and teams, edit/delete with audit history, reserved slugs, rate limiting and CSRF protection, OpenTelemetry traces and structured logging, API integration tests against an isolated database, pagination, health checks, and a browser-extension/DNS setup so bare `go/slug` works from the address bar.
