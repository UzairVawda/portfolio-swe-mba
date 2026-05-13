# uzairvawda-portfolio

Personal portfolio for [uzairvawda.me](https://uzairvawda.me) — software engineer + MBA candidate.

Two sections:
- **`/`** — main SWE portfolio (experience, skills, projects)
- **`/mba`** — MBA consulting pivot: tools shipped per class, journal, speaking, about

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · shadcn/ui · motion (framer-motion)
- Supabase (Postgres + RLS) for contact form storage
- Resend for transactional email
- Vercel hosting · GitHub Actions CI
- Vitest (unit) · Playwright (E2E)

## Local development

```bash
npm install
cp .env.example .env.local
# fill in Supabase + Resend keys
npm run dev
```

Open <http://localhost:3000>.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Environment variables

See `.env.example`. Real values live in Vercel project settings, never committed.

## Deployment

Pushes to `main` auto-deploy to Vercel production. Preview deploys on every PR.
