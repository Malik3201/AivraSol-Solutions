# AIVRASOL — Full-Stack Next.js Platform

Premium AI and digital services website for **AIVRASOL**, built as a single Next.js App Router project at the repository root (no nested app folder).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **MongoDB Atlas** + **Mongoose**
- **JWT admin auth** (`jose`, httpOnly cookie)
- **Zod** validation
- **ImageKit**, **Groq AI**, **Framer Motion**, **GSAP**

## Getting started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`. Server and public env are validated separately in `lib/env.ts`.

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL (SEO, sitemap) |
| `MONGODB_URI` | Server | MongoDB Atlas connection string |
| `ADMIN_JWT_SECRET` | Server | JWT signing secret (16+ chars) |
| `ADMIN_JWT_EXPIRES_IN` | Server | Token/cookie lifetime (e.g. `7d`) |
| `ADMIN_SEED_*` | Server | Initial super admin for seed script |
| `IMAGEKIT_*` | Server / Public | Media upload and CDN |
| `GROQ_*` | Server | Groq AI API (chat completions) |
| `CONTACT_RECEIVER_EMAIL` | Server | Contact notification target |

Never commit `.env.local` or log secret values.

## MongoDB Atlas setup

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and network access rule.
3. Set `MONGODB_URI` in `.env.local`.
4. Seed the first super admin:

```bash
npm run seed:admin
```

The seed script creates a `super_admin` only if the email does not exist; it will **not** overwrite an existing admin password.

## Auth API

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Email/password login, sets `aivrasol_admin_token` cookie |
| `GET` | `/api/auth/me` | Current admin (no `passwordHash`) |
| `POST` | `/api/auth/logout` | Clears session cookie |

Cookie: `aivrasol_admin_token` — httpOnly, `sameSite=lax`, `secure` in production.

Admin roles: `super_admin` | `admin` | `editor` (see `lib/permissions.ts`).

## Health API

```bash
curl http://localhost:3000/api/health
```

Returns `appName`, `status`, `timestamp`, integration flags, and `environment` — never secrets.

## API response format

All routes return JSON:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Errors:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

List routes include pagination in `meta` when applicable.

## Public content APIs (no auth)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/public/home` | Homepage bundle (hero, featured content, SEO) |
| GET | `/api/public/services` | Active services (`page`, `limit`, `search`, `featured`) |
| GET | `/api/public/services/[slug]` | Service detail + related projects/FAQs + SEO |
| GET | `/api/public/projects` | Active projects (`page`, `limit`, `search`, `technology`, `service`, `featured`) |
| GET | `/api/public/projects/[slug]` | Project detail + related services + SEO |
| GET | `/api/public/team` | Active team members |
| GET | `/api/public/team/[slug]` | Team member detail + SEO |
| GET | `/api/public/testimonials` | Active testimonials |
| GET | `/api/public/faqs` | Active FAQs (`category` optional) |
| GET | `/api/public/blog` | Published posts (`page`, `limit`, `search`, `tag`, `featured`) |
| GET | `/api/public/blog/[slug]` | Published post + related posts + SEO |
| GET | `/api/public/settings` | Public site settings as key/value object (`isPublic: true` only) |
| GET | `/api/public/seo/[pageKey]` | Page SEO (`home`, `about`, `services`, `projects`, `team`, `contact`, `blog`) |
| POST | `/api/contact` | Submit contact lead (rate limited) |
| POST | `/api/contact/assist` | AI-polished contact message draft |
| GET | `/api/public/schema/organization` | JSON-LD Organization schema |
| GET | `/api/public/schema/service/[slug]` | Service + breadcrumb JSON-LD |
| GET | `/api/public/schema/project/[slug]` | Project + breadcrumb JSON-LD |
| GET | `/api/public/schema/blog/[slug]` | BlogPosting + breadcrumb JSON-LD |

Public APIs never return inactive content, drafts, or admin-only fields.

## Admin CMS APIs (auth required)

Send requests with session cookie `aivrasol_admin_token` (set by `POST /api/auth/login`).

### Role permissions

| Role | Content CRUD | Delete content | Site settings | Contact leads | Delete leads |
|------|--------------|----------------|---------------|---------------|--------------|
| `super_admin` | Yes | Yes | Yes | Yes | Yes |
| `admin` | Yes | Yes | Yes | Yes | Yes |
| `editor` | Yes | No | No | No | No |

### Dashboard & search

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Counts, recent leads, recent AI logs, recent updates |
| GET | `/api/admin/search?q=` | Grouped search across all content types |

### CRUD resources

| Resource | List/Create | Get/Update/Delete | Notes |
|----------|-------------|-------------------|-------|
| Services | `GET/POST /api/admin/services` | `GET/PATCH/DELETE /api/admin/services/[id]` | Auto unique slug |
| Projects | `GET/POST /api/admin/projects` | `GET/PATCH/DELETE /api/admin/projects/[id]` | |
| Team | `GET/POST /api/admin/team-members` | `GET/PATCH/DELETE /api/admin/team-members/[id]` | |
| Testimonials | `GET/POST /api/admin/testimonials` | `GET/PATCH/DELETE /api/admin/testimonials/[id]` | |
| FAQs | `GET/POST /api/admin/faqs` | `GET/PATCH/DELETE /api/admin/faqs/[id]` | |
| Blog | `GET/POST /api/admin/blog-posts` | `GET/PATCH/DELETE /api/admin/blog-posts/[id]` | Draft by default |
| Blog publish | — | `PATCH /api/admin/blog-posts/[id]/publish` | Sets `published` + `publishedAt` |
| Blog unpublish | — | `PATCH /api/admin/blog-posts/[id]/unpublish` | Sets `draft` |
| Site settings | `GET/POST /api/admin/site-settings` | `PATCH/DELETE /api/admin/site-settings/[id]` | Admin/super_admin only |
| Contact leads | `GET /api/admin/contact-leads` | `GET/PATCH/DELETE /api/admin/contact-leads/[id]` | Leads: admin/super_admin |
| Media library | `GET /api/admin/media` | `PATCH/DELETE /api/admin/media/[id]` | ImageKit-backed assets |

List routes support `page`, `limit`, and `search` where applicable.

## Upload & media (ImageKit)

Requires `IMAGEKIT_*` env vars. Private key is server-only.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/upload/auth` | Admin | Client upload signature (`token`, `expire`, `signature`, `publicKey`, `urlEndpoint`) |
| POST | `/api/upload/image` | Admin | Multipart `file`, optional `folder`, `altText` → saves `MediaAsset` |
| POST | `/api/upload/multiple` | Admin | Multipart `files[]` or `files`, optional `folder` |
| GET | `/api/admin/media` | Admin | Paginated media (`folder`, `mimeType`, `search`) |
| PATCH | `/api/admin/media/[id]` | Admin | Update `altText`, `folder` |
| DELETE | `/api/admin/media/[id]` | Admin/super_admin | Delete from ImageKit + MongoDB |

Allowed folders: `/aivrasol/services`, `/projects`, `/team`, `/blog`, `/brand`, `/general`  
Allowed types: JPEG, PNG, WebP, AVIF (max 5MB). SVG rejected.

## Groq AI

Env: `GROQ_API_KEY`, `GROQ_MODEL` (default: `llama-3.3-70b-versatile`)

Uses the OpenAI-compatible endpoint `https://api.groq.com/openai/v1/chat/completions`. See [Groq models](https://console.groq.com/docs/models) for other IDs (e.g. `llama-3.1-8b-instant`, `openai/gpt-oss-20b`).

OpenAI-compatible chat completions with timeout, safe errors, and `AiLog` auditing.

### Public AIVA chatbot

`POST /api/aiva/chat` (alias: `POST /api/ai/aiva/chat`)

```json
{ "message": "...", "sessionId": "optional", "pageContext": "optional", "currentPage": "/services" }
```

Returns `reply`, `suggestedActions`, `leadIntent`, `recommendedServiceSlug`. Uses only active public CMS data. Rate limited.

### Contact assist

- `POST /api/contact/assist`
- `POST /api/ai/contact-assist` (alias)

Generates a polished inquiry message; logs `contact_email_assist`.

### Admin AI drafts (do not auto-save)

All require admin cookie. Return drafts only — save via normal CMS CRUD.

| Route | Purpose |
|-------|---------|
| `POST /api/ai/admin/service-content` | Service page draft |
| `POST /api/ai/admin/project-content` | Case study draft |
| `POST /api/ai/admin/blog-content` | Blog article draft |
| `POST /api/ai/admin/faq-content` | FAQ set draft |
| `POST /api/ai/admin/seo-content` | SEO metadata draft |

If Groq is unavailable, a fallback template is returned with `aiNotice`.

## Contact workflow

1. User submits `POST /api/contact` → validated, sanitized, saved as `ContactLead` (`status: new`).
2. `lib/services/contact.ts` attempts email notification if `CONTACT_RECEIVER_EMAIL` is set (SMTP placeholder — lead save never fails).
3. Admin reviews/updates via `/api/admin/contact-leads`.
4. Optional: user runs contact assist before submitting.

## Rate limiting

In-memory limiter in `lib/utils/rate-limit.ts` (development/small deploy). **Use Redis (e.g. Upstash) in production.**

| Route | Limit |
|-------|-------|
| `POST /api/auth/login` | 10 / 15 min per IP |
| `POST /api/contact` | 5 / 15 min per IP |
| `POST /api/contact/assist` | 10 / 15 min per IP |
| `POST /api/aiva/chat` (alias: `POST /api/ai/aiva/chat`) | 20 / 10 min per session or IP |
| Admin AI routes | 30 / hour per admin |

Returns `429` with `{ success: false, message, errors: { retryAfter } }`.

## Production security checklist

- [ ] Strong `ADMIN_JWT_SECRET` (32+ random characters)
- [ ] Strong seeded admin password; rotate after first login
- [ ] MongoDB Atlas IP allowlist / VPC peering
- [ ] Never expose `IMAGEKIT_PRIVATE_KEY` or `GROQ_API_KEY` to the client
- [ ] Set `NODE_ENV=production` and HTTPS-only cookies
- [ ] Replace in-memory rate limiter with Redis for multi-instance deploys
- [ ] Configure `CONTACT_RECEIVER_EMAIL` + SMTP when ready
- [ ] Vercel/Render: set all env vars in dashboard; enable deployment protection for preview
- [ ] Review ImageKit folder permissions and upload restrictions
- [ ] Monitor `AiLog` collection for abuse patterns

### How the admin panel should use these APIs

1. Log in via `POST /api/auth/login` — browser stores httpOnly cookie automatically.
2. Use TanStack Query (or fetch with `credentials: 'include'`) for all `/api/admin/*` calls.
3. Load dashboard stats from `/api/admin/dashboard`.
4. Use resource CRUD endpoints for CMS modules; validate forms with the same Zod shapes in `lib/validators/content.validator.ts`.
5. Publish blog posts via dedicated publish/unpublish routes.
6. Store branding/hero/SEO in site settings (`homeHero`, `globalSeo`, `robotGuideSettings`, etc.) with `isPublic` for fields exposed on the marketing site.

## Backend architecture

```
lib/
├── env.ts                 # Zod serverEnv + publicEnv
├── db.ts                  # Cached Mongoose connection
├── auth.ts                # JWT, cookies, requireAdmin/requireRole
├── permissions.ts         # Role hierarchy and permission maps
├── api-response.ts        # successResponse / errorResponse
├── api-error.ts           # ApiError + handleApiError
├── models/                # Mongoose schemas (Admin, Service, Project, …)
├── validators/            # Zod request schemas
├── services/              # SEO, ImageKit, LongCat, contact, public-content
└── utils/                 # slugify, sanitize, pagination, rate-limit, request-ip

app/api/
├── health/
├── auth/login|me|logout/
├── public/… + schema/organization|service|project|blog
├── admin/dashboard|search|media|services|…
├── contact/ + assist/
├── upload/auth|image|multiple
└── ai/aiva|admin/*|contact-assist

lib/services/
├── public-content.ts      # Public read aggregations
├── admin-crud.ts          # Shared CRUD helpers
├── imagekit.ts            # Upload, delete, thumbnails
├── longcat.ts             # Groq AI completions + feature wrappers
├── contact.ts             # Lead save + email placeholder
└── seo.ts                 # Metadata + JSON-LD schemas

scripts/
└── seed-admin.ts
```

### Mongoose models

- **Admin** — CMS users and roles
- **Service**, **Project**, **TeamMember**, **Testimonial**, **FAQ**, **BlogPost**
- **ContactLead** — form submissions
- **SiteSetting** — key/value site config
- **MediaAsset** — ImageKit metadata
- **AiLog** — AI feature audit trail

All models use `models.X || mongoose.model(...)` for Next.js hot reload safety.

## Deploy on Vercel

1. Import this repository in [Vercel](https://vercel.com/new) (framework: **Next.js** — auto-detected).
2. Add environment variables from `.env.example` in the Vercel project **Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://aivrasol.com`) for **Production** — used for SEO and www → apex redirects (same path, canonical host).
4. Deploy. Preview deployments use `*.vercel.app`; host redirects are skipped for preview URLs.

`vercel.json` sets the build/install commands and default region. Redirects and rewrites live in `next.config.ts` via `lib/build-redirects.ts`:

| Rule | Behavior |
|------|----------|
| `www.` → apex | `www.example.com/foo` → `https://example.com/foo` (same path) |
| Trailing slash | `/about/` → `/about` |
| Legacy Aiva API | `/api/ai/aiva/chat` → `/api/aiva/chat` (rewrite, POST-safe) |

Point your custom domain in Vercel and add both apex and `www` if you use www; the redirect sends traffic to `NEXT_PUBLIC_SITE_URL`’s host.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Seed super admin from `.env.local` |

## Project structure (root)

```
app/                 # Pages + API route handlers
components/          # UI, site, admin, animations, aiva
lib/                 # Backend core
public/              # Static assets
scripts/             # CLI utilities
middleware.ts        # Admin route protection
package.json
next.config.ts
vercel.json
lib/build-redirects.ts
tsconfig.json
.env.example
```

## Next steps

1. Admin login UI + media picker wired to `/api/upload/*`
2. Wire public pages to `/api/public/*` and JSON-LD schema routes
3. AIVA chat widget → `/api/aiva/chat`
4. SMTP/nodemailer for contact notifications
5. Redis rate limiter for production
6. AIVA scroll experience (`components/aiva/`)

## License

Private — AIVRASOL.
