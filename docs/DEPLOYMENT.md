# Deployment

## 1. Pre-flight checklist

- [ ] `NEXT_PUBLIC_SITE_URL` = final origin (https, no trailing slash)
- [ ] `NEXT_PUBLIC_SITE_ENV=production` (only on the production deployment)
- [ ] Contact delivery configured (`CONTACT_PROVIDER` + its variables), or accept that the form shows "not connected"
- [ ] `src/content/site.ts` filled with confirmed facts, socials and legal identity
- [ ] Legal documents reviewed by a professional; `studio.legal.lastReviewed` set
- [ ] Placeholder games and sample journal entries replaced or removed
- [ ] `npm run check` and `npm run test:e2e` pass

## 2. Vercel (simplest)

1. Import the repository (or upload the folder) as a Next.js project.
2. In _Settings → Environment Variables_, add the variables:
   - **Production:** `NEXT_PUBLIC_SITE_ENV=production`.
   - **Preview:** leave it unset, so previews are automatically noindex.
3. Deploy, then add the custom domain and redirect the apex to `www` (or the reverse). Make sure the redirect target matches `NEXT_PUBLIC_SITE_URL`.

The contact rate limiter is in-memory, so on serverless each instance has its own counter. For stricter limits, swap `src/lib/contact/rate-limit.ts` for a shared store such as Upstash Redis or Vercel KV. Alternatively, add a CAPTCHA such as Cloudflare Turnstile. Turnstile adds a third-party script: update the CSP and the privacy policy.

## 3. Any Node.js host (VPS, Docker, Render, Fly.io, …)

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://www.example.com NEXT_PUBLIC_SITE_ENV=production npm run build
PORT=3000 npm run start
```

Then:

- Run behind a reverse proxy (Nginx or Caddy) with HTTPS and HTTP→HTTPS redirects.
- Forward `X-Forwarded-For`, which the contact rate limiter uses.
- Use a process manager (systemd or pm2) or a container with restart policies.

Minimal Dockerfile:

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_ENV=production
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 4. Security headers

`next.config.ts` sends these on every response:

- `X-Content-Type-Options`
- `Referrer-Policy`
- `X-Frame-Options: DENY`
- `Permissions-Policy`
- a production **Content-Security-Policy** (`default-src 'self'`, no third-party origins)

Inline scripts are limited to the motion/consent bootstrap and JSON-LD, which is why `'unsafe-inline'` is allowed for scripts. To tighten further, move to nonce-based CSP. That requires dynamic rendering, so evaluate the trade-off first.

Add HSTS at your edge once HTTPS is confirmed: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

## 5. Caching

- Pages are statically prerendered (SSG).
- Static assets under `/brand`, `/images`, `/textures`, `/icons` and `/og` are cached for 7 days. Raise this if filenames become content-hashed.
- `/_next/static` is immutable (handled by Next).
- `next/image` caches optimized variants on the server.

## 6. Environment changes

`NEXT_PUBLIC_*` values and the "form connected" notice are baked in at build time. **Rebuild and redeploy after changing environment variables.**

## 7. After launch

- Submit the sitemap (see `SEO.md`).
- Check `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and the OG previews (opengraph.xyz, LinkedIn Post Inspector).
- Re-run Lighthouse against the live URL. Real CDN/HTTP2 conditions usually beat local numbers.
