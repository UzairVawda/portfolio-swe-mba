# Launch checklist

> Manual launch steps. Code is in good shape; these are the things only the user (account holder) can do.

---

## 1. Run the Supabase migration (one-time)

Before the contact form works in production:

1. Supabase dashboard → **SQL Editor** → **New query**
2. Paste the contents of `supabase/migrations/0001_contact_submissions.sql`
3. Run it
4. Verify in **Table Editor** that `contact_submissions` exists with **RLS** enabled (toggle in the table header)

## 2. Add `RATE_LIMIT_SECRET` to Vercel

1. Generate a long random string locally: `openssl rand -hex 32`
2. Vercel → project → **Settings → Environment Variables**
3. Add `RATE_LIMIT_SECRET` for **Production + Preview + Development**
4. Trigger a redeploy (push or "Redeploy" button on the latest deployment)

Required env vars in Vercel (already added, double-check):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL=hello@uzairvawda.me`
- `CONTACT_TO_EMAIL=uzair.vawda@gmail.com`
- `RATE_LIMIT_SECRET` (new)
- `NEXT_PUBLIC_SITE_URL=https://uzairvawda.me` (recommended for absolute URLs in sitemap + OG)

## 3. Drop the resume

Save the actual file at `public/resume.pdf` so the `/mba/about` Resume link resolves. Until then it 404s.

## 4. Self-host Umami (analytics)

Umami is a separate Vercel project that uses Supabase as its Postgres backend. Steps:

1. Fork `https://github.com/umami-software/umami`
2. Create a new Vercel project pointing at the fork
3. Add a Postgres database — either:
   - **Easier**: spin up a second free Supabase project just for Umami (keeps your portfolio DB clean)
   - **Or**: add a `umami` schema to the existing Supabase project
4. Set `DATABASE_URL` env var on the Umami Vercel project to the Postgres connection string
5. Set `HASH_SALT` to any long random string
6. Deploy. First boot runs migrations.
7. Log into the Umami admin UI (`<umami-url>/login`) — default user is `admin` / `umami` — change the password immediately.
8. Add your portfolio site, get the tracking script tag
9. Drop the script into `src/app/layout.tsx` inside a `<Script src="..." strategy="afterInteractive" />` (note `<Script>` from `next/script`)
10. Verify hits appear in the Umami dashboard after visiting the site

Deferring Umami until post-launch is also fine — Vercel's built-in analytics covers the basics.

## 5. DNS migration (uzairvawda.me → Vercel)

When you're ready to flip from the old GitHub Pages site:

1. Vercel → project → **Settings → Domains** → **Add Domain** → enter `uzairvawda.me` and `www.uzairvawda.me`
2. Vercel will show DNS records to configure:
   - Apex `uzairvawda.me` → A record `76.76.21.21` (Vercel anycast)
   - `www.uzairvawda.me` → CNAME `cname.vercel-dns.com.`
3. Namecheap → Domain List → **Manage** → **Advanced DNS**
4. Remove the existing GitHub Pages A records / CNAME
5. Add the Vercel records
6. Wait for propagation (usually 5–30 min, occasionally hours)
7. Vercel will auto-issue an SSL cert once DNS resolves to it

The Resend DNS records on `send.uzairvawda.me` and `resend._domainkey` should stay — they're independent of the root.

## 6. Final QA pass

Before announcing:

- [ ] Real submission through the contact form on production → row in Supabase + email in inbox
- [ ] Rate limit kicks in on second submission within 60s
- [ ] Validation errors render (try empty submit, bad email)
- [ ] Both `/` and `/mba` render correctly in light and dark
- [ ] Mobile (~375px wide) reads cleanly all the way down both pages
- [ ] Theme toggle persists across reloads
- [ ] First-visit hint appears (clear `localStorage`), dismisses correctly
- [ ] All section nav links scroll smoothly on the SWE page (#about, #experience, #skills, #projects, #education, #off-screen)
- [ ] MBA nav (Tools/Journal/Speaking/About) all reachable from desktop and mobile sheet
- [ ] Resume link downloads the PDF
- [ ] LinkedIn / GitHub external links open in new tab
- [ ] OG preview looks right — use https://www.opengraph.xyz/ or Slack/LinkedIn preview
- [ ] sitemap.xml resolves at `uzairvawda.me/sitemap.xml`
- [ ] robots.txt resolves at `uzairvawda.me/robots.txt` (and disallows `/api/`)
- [ ] No console errors on either page
- [ ] Lighthouse run on production URL: aim for 90+ on Performance, Accessibility, Best Practices, SEO

## 7. After launch

- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools (optional)
- Post launch on LinkedIn (carousel of the site walkthrough works well)
- Update LinkedIn profile to link the site
