# Deployment Checklist

## Pre-Deployment

- [ ] All Stage 07 test audit checks pass
- [ ] Security report (Stage 06) shows no open High/Critical issues
- [ ] Environment variables documented and ready (never committed to git)
- [ ] Client domain and DNS access confirmed
- [ ] Supabase production project configured (separate from dev)
- [ ] ETL scheduling configured and tested

## Vercel Deployment

### Initial Setup
1. `vercel link` in project root → link to Vercel team/account
2. Set framework preset: Vite (for React apps)
3. Set build command: `turbo build --filter=./apps/clients/[client-slug]`
4. Set output directory: `apps/clients/[client-slug]/dist`
5. Add all environment variables in Vercel Dashboard → Settings → Environment Variables

### Environment Variables (Production)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLIENT_ID=[client UUID from DB]
VITE_API_URL=https://api.pixelpro.ca
VITE_SENTRY_DSN=https://...
```

### Custom Domain
1. Vercel Dashboard → Project → Settings → Domains
2. Add custom domain (e.g., `www.clientsite.ca`)
3. Update DNS: add CNAME `www` → `cname.vercel-dns.com`
4. Add apex redirect: add A record `@` → `76.76.21.21`
5. Wait for propagation (up to 48h; usually < 1h)
6. Verify HTTPS active and certificate issued

## Post-Deployment Verification

- [ ] `https://clientsite.ca` loads without errors
- [ ] All pages render correctly on desktop and mobile
- [ ] Contact/quote form submits successfully (test submission)
- [ ] GA4 real-time view shows visits from test
- [ ] Custom events table in Supabase receiving rows
- [ ] Dashboard accessible at `https://dashboard.pixelpro.ca/[client-slug]`
- [ ] Client credentials delivered and login confirmed
- [ ] ETL scheduled job confirmed active
- [ ] Uptime monitor configured and sending test alert

## DNS Records Reference

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | Apex domain → Vercel |
| CNAME | www | cname.vercel-dns.com | www → Vercel |
| TXT | @ | (verification string) | Domain ownership verification |
| MX | @ | (mail provider) | Email (if needed) |

## Security Headers Verification

After deploy, run:
```bash
curl -I https://clientsite.ca
```
Verify presence of: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

Also check: https://securityheaders.com — target B+ minimum.
