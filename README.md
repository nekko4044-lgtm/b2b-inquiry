# LeseweltVerlag B2B Inquiry Tool

A lightweight B2B inquiry form for a German publisher selling to libraries and kindergartens. Institutions submit book requests via a German-language form; the system stores leads in a PostgreSQL database, sends a branded confirmation email to the institution, and notifies the admin.

**Live Demo:** _link after Vercel deployment_

---

## Tech Stack

| Technology | Role | Why |
|---|---|---|
| Next.js 16 (App Router) | Fullstack framework | Frontend + API in one repo, zero config, deploys to Vercel in minutes |
| TypeScript | Type safety | Catches field mismatches between form, validator, DB insert, and email at compile time |
| Tailwind CSS + shadcn/ui | Styling & components | Production-quality components with zero custom CSS overhead |
| Supabase (PostgreSQL) | Lead storage | Managed Postgres with a web dashboard — no migrations to run locally |
| Resend + React Email | Transactional email | Emails written as React components, not raw HTML strings |
| Zod v4 | Validation | Declarative schemas with TypeScript inference; one schema covers both client and server |
| Vercel | Deployment | Native Next.js integration, automatic HTTPS, edge network |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Resend](https://resend.com) account with an API key

### Installation

```bash
git clone <repo-url>
cd lesewelt-inquiry
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your values (see [Environment Variables](#environment-variables) below).

### Database Setup

Open **Supabase Dashboard → SQL Editor** and run:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  institution_type text check (institution_type in ('Bibliothek', 'Kita')),
  institution_name text not null,
  contact_name text not null,
  email text not null,
  titles jsonb not null default '[]',
  notes text,
  ip_address text,
  created_at timestamptz default now(),
  status text default 'new' check (status in ('new', 'contacted', 'closed'))
);
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for client) | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-only, never expose to client** | `eyJhbG...` |
| `RESEND_API_KEY` | Resend API key for sending emails | `re_xxxxxxxx` |
| `FROM_EMAIL` | Verified sender address | `noreply@lesewelt-verlag.de` |
| `ADMIN_EMAIL` | Where admin notifications are sent | `bestellungen@lesewelt-verlag.de` |

### Why secrets must never be hardcoded

Committing API keys directly into source code is dangerous: Git preserves every version of every file in history — even if you delete a key in a later commit, it remains visible in `git log`. Additionally, public GitHub repositories are scanned by automated bots within minutes of a push, and any leaked credentials will be used almost immediately (spam campaigns, unauthorized API usage, billing charges). Environment variables keep secrets out of version control entirely.

---

## API Reference

### `POST /api/inquiry`

Accepts a JSON body, validates it, stores the lead, and sends two emails.

**Request body:**

```json
{
  "institution_type": "Bibliothek",
  "institution_name": "Stadtbibliothek München",
  "contact_name": "Anna Müller",
  "email": "a.mueller@stb-muenchen.de",
  "titles": [
    { "title": "Leselöwen 1. Klasse", "quantity": 5 },
    { "title": "Pixi-Bücher Set", "quantity": 20 }
  ],
  "notes": "Lieferung bis Ende Oktober",
  "hp_field": ""
}
```

**Responses:**

| Status | Body |
|---|---|
| `200` | `{ "success": true, "message": "Ihre Anfrage wurde erfolgreich übermittelt." }` |
| `400` | `{ "success": false, "errors": { "email": "Ungültige E-Mail-Adresse" } }` |
| `500` | `{ "success": false, "message": "Ein interner Fehler ist aufgetreten..." }` |

---

## Spam Protection

Two layers of protection cover the requirements for this project:

**Layer 1 — Honeypot field**
A hidden `hp_field` input is present in the HTML but invisible to human users (`display: none`, `tabIndex={-1}`). Bots filling in all form fields will populate it. The server silently returns `200` without storing anything — the bot receives no feedback that it was detected.

**Layer 2 — Server-side Zod validation**
Every field is re-validated on the server regardless of what the client sends. Malformed requests (wrong types, missing required fields, invalid email format, out-of-range quantities) are rejected with `400` and a field-level error map.

> **Production note:** Rate limiting per IP (e.g. via [Upstash Redis](https://upstash.com)) would be the natural next step for a production deployment to prevent bulk automated submissions.

---

## Project Structure

```
lesewelt-inquiry/
├── .env.example              # Template — commit this, not .env.local
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout, font (Onest), Toaster
│   │   ├── page.tsx          # Landing page with brand header + form
│   │   └── api/
│   │       └── inquiry/
│   │           └── route.ts  # POST handler — validate → store → email
│   ├── components/
│   │   ├── InquiryForm.tsx   # Main client form component
│   │   └── ui/               # shadcn/ui generated components
│   ├── emails/
│   │   ├── ConfirmationEmail.tsx  # Branded confirmation to institution
│   │   └── AdminNotifyEmail.tsx   # Internal notification to admin
│   ├── lib/
│   │   ├── supabase.ts       # Public + admin Supabase clients
│   │   ├── mailer.ts         # sendConfirmation + sendAdminNotification
│   │   └── validator.ts      # Zod schema + parseInquiry helper
│   └── types/
│       └── inquiry.ts        # Shared TypeScript interfaces
```

---

## Deployment to Vercel

1. Push the repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repository
3. In **Settings → Environment Variables**, add all variables from `.env.example` with their real values
4. Deploy — Vercel auto-detects Next.js and builds it

> Make sure `FROM_EMAIL` uses a domain verified in your Resend account. For quick testing, `onboarding@resend.dev` works without domain verification but only delivers to the account owner's email.

---

## License

MIT
