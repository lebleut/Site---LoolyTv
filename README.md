# LoolyTv marketing site

Next.js App Router site for [https://loolytv.com](https://loolytv.com).

**Hosting:** Vercel (`https://site-looly-tv.vercel.app`). Not part of the VPS Docker stack.

## Scripts

- `npm run dev` — local server (default http://localhost:3000)
- `npm run build` / `npm start` — production

## Environment

Copy `.env.example` to `.env.local` (and set the same vars in the Vercel project):

- `NEXT_PUBLIC_SITE_URL` — canonical site origin (`https://loolytv.com`)
- `NEXT_PUBLIC_API_URL` — Nest API origin (waitlist, contact, data-deletion), e.g. `https://api.loolytv.com`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — Google reCAPTCHA **v3** site key (browser)
- `RECAPTCHA_SECRET_KEY` — Google reCAPTCHA **v3** secret (server only; never expose to the client)

Forms (`waitlist`, `contact`, `data-deletion`) obtain a v3 token in the browser, then POST to Next.js `/api/public/*` routes which verify the token with Google before proxying to the Nest API.

## Locales

`en` (default), `fr`, `ar` (RTL), `es` under `/[locale]`.

Legal pages (English) live at `/legal/*`.
