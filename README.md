# LoolyTv marketing site

Next.js App Router site for [https://loolytv.com](https://loolytv.com).

## Scripts

- `npm run dev` — local server (default http://localhost:3000)
- `npm run build` / `npm start` — production

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical site origin
- `NEXT_PUBLIC_API_URL` — Nest API origin (waitlist, contact, data-deletion)

## Locales

`en` (default), `fr`, `ar` (RTL), `es` under `/[locale]`.

Legal pages (English) live at `/legal/*`.
