# Go Links Recording Script

This script is designed for a five-to-seven-minute project walkthrough.

## 1. Introduction — 30 seconds

> Hi, this is my implementation of Go Links, a small internal URL-shortcut service.
>
> The goal is to turn long URLs into memorable shortcuts such as `go/design-system`, make those shortcuts discoverable, and redirect users to the correct destination.
>
> I focused on delivering a clean first iteration that another engineering team could understand and continue developing.

## 2. Product walkthrough — 1–2 minutes

> On the homepage, users can see all existing team shortcuts.
>
> Each shortcut includes its memorable `go/` path, a short description, its visit count, and a button for copying the link.
>
> The search field filters shortcuts immediately, which makes the directory usable as the number of links grows.
>
> To create a shortcut, I select “New shortcut.” The form asks for a slug, destination URL, and optional description.
>
> Validation happens immediately in the browser. Slugs must use lowercase letters, numbers, and hyphens, and destinations must be valid HTTP or HTTPS URLs.
>
> The same validation is repeated on the server because client-side validation alone should never be trusted.
>
> Once submitted, the shortcut is persisted to SQLite and appears in the directory. Duplicate shortcuts return a clear error rather than silently overwriting an existing link.

## 3. Redirect flow — 45 seconds

> When someone visits `/go/design-system`, the application looks up `design-system` in the database, atomically increments its visit count, and redirects the browser to the stored destination.
>
> If the shortcut doesn’t exist, the user is returned to the homepage with a helpful message inviting them to create it.
>
> In a real company environment, DNS or a browser extension would allow users to type the shorter `go/design-system` form directly.

## 4. Architecture — 1–2 minutes

> The application uses Next.js with TypeScript and the App Router.
>
> The UI is built with Tailwind, reusable shadcn-style components, Lucide icons, React Hook Form, and Zod.
>
> The code is separated by responsibility:
>
> - `src/app` contains pages and HTTP route handlers.
> - `src/components` contains feature components and reusable UI primitives.
> - `src/lib/validation` contains the shared Zod contract.
> - `src/lib/links.ts` contains the application and data-access operations.
> - `src/lib/prisma.ts` owns the Prisma client lifecycle.
> - `prisma` contains the SQLite schema, migrations, and seed data.
>
> The create form uses React Hook Form for interaction and Zod for validation. That same Zod schema is used by the API, keeping browser and server rules consistent.
>
> Prisma provides type-safe database access, while SQLite makes the project easy to run locally without requiring external infrastructure.

## 5. API and reliability — 1 minute

> The API exposes two primary operations:
>
> - `GET /api/links` lists shortcuts.
> - `POST /api/links` creates a shortcut.
>
> Creation returns appropriate status codes: `201` when a shortcut is created, `409` for a duplicate slug, `422` for invalid input, and `500` for an unexpected failure.
>
> Mutation responses include a request ID. Unexpected errors are logged with that request ID, giving us a basic foundation for correlating user-facing failures with server logs.
>
> Database uniqueness is enforced by SQLite, not only application code, which also protects against concurrent requests attempting to create the same shortcut.

## 6. Engineering tradeoffs — 1 minute

> I intentionally kept this iteration focused.
>
> Search happens in the browser because the expected initial dataset is small. At larger scale, I would move filtering and pagination to the server.
>
> SQLite provides a frictionless local experience, but for a multi-instance production deployment I would likely move to managed Postgres.
>
> Visit counting happens during the redirect. That provides simple and consistent behavior, although it adds a database write to a latency-sensitive path. At higher scale, I would consider asynchronous analytics.
>
> I also assumed the application runs inside an authenticated company environment, so authentication and authorization are outside this first iteration.

## 7. What I’d add next — 45 seconds

> With another day, I would prioritize:
>
> - Company SSO and role-based permissions
> - Shortcut ownership and teams
> - Editing and deleting with audit history
> - Reserved and protected slugs
> - Rate limiting and additional security controls
> - Structured logs and OpenTelemetry tracing
> - Integration and end-to-end tests
> - Server-side pagination and search
> - A browser extension or internal DNS configuration for bare `go/slug` navigation
>
> Overall, the project is deliberately small, but its boundaries make those additions straightforward.

## 8. Closing — 15 seconds

> That’s the Go Links first iteration. My main goal was to balance a thoughtful user experience with maintainable code, explicit validation, reliable persistence, and a clear path toward a production-ready internal tool.

## High-level application flow

```text
User creates shortcut
        ↓
React Hook Form + Zod validation
        ↓
POST /api/links
        ↓
Server-side Zod validation
        ↓
Link service
        ↓
Prisma → SQLite

User visits /go/design-system
        ↓
Link service finds the record
        ↓
Visit count increments
        ↓
HTTP redirect to destination
```

The central design choice is shared validation and clear separation of responsibilities: components handle presentation, API routes handle HTTP concerns, the link service handles business and data operations, and Prisma handles persistence.
