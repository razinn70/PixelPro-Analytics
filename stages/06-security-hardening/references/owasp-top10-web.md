# OWASP Top 10 — Node.js / React Stack

## A01: Broken Access Control
- [ ] Every API endpoint requires auth except explicitly public routes
- [ ] RLS policies tested for cross-client data access
- [ ] No client-side access control (always enforce server-side)
- [ ] Directory listing disabled on all servers
- [ ] CORS restricted to known origins only

## A02: Cryptographic Failures
- [ ] HTTPS enforced everywhere (HSTS header set)
- [ ] No sensitive data in query strings (use POST body)
- [ ] Passwords hashed with bcrypt (min cost 12) — Supabase handles this
- [ ] JWT secrets are high-entropy random values (not guessable strings)
- [ ] No plaintext secrets in code, logs, or environment variable dumps

## A03: Injection
- [ ] All SQL queries use parameterized statements (Prisma/Supabase SDK)
- [ ] No raw SQL string concatenation with user input anywhere
- [ ] All user input validated/sanitized server-side with Zod
- [ ] NoSQL injection not applicable (PostgreSQL only)

## A04: Insecure Design
- [ ] Rate limiting on all endpoints
- [ ] Anti-automation on form submissions (honeypot fields)
- [ ] Data minimization: collect only what's needed

## A05: Security Misconfiguration
- [ ] `NODE_ENV=production` in production environment
- [ ] Default error handler does not expose stack traces
- [ ] Helmet.js applied to all Express responses
- [ ] Unused endpoints removed or disabled
- [ ] `.env` files not committed to git

## A06: Vulnerable and Outdated Components
- [ ] `npm audit` returns zero high/critical vulnerabilities
- [ ] `pip audit` returns zero high/critical vulnerabilities
- [ ] Dependabot alerts reviewed and addressed weekly
- [ ] No use of abandoned packages (> 2 years no maintenance)

## A07: Identification and Authentication Failures
- [ ] JWT validation on every protected endpoint
- [ ] Token expiry enforced (Supabase default: 1 hour)
- [ ] No tokens stored in localStorage (use memory or httpOnly cookies)
- [ ] Session invalidated on logout

## A08: Software and Data Integrity Failures
- [ ] `npm ci` used in CI/CD (respects lockfile)
- [ ] No untrusted npm packages for security-critical functions
- [ ] GitHub Actions pinned to specific SHA, not floating tags

## A09: Security Logging and Monitoring Failures
- [ ] All auth failures logged with request ID and timestamp
- [ ] Rate limit hits logged
- [ ] No PII in logs (no email, phone, IP, name)
- [ ] Logs shipped to monitoring service (Vercel, Sentry, or Logtail)

## A10: Server-Side Request Forgery (SSRF)
- [ ] No endpoints that fetch arbitrary URLs based on user input
- [ ] Webhook endpoints validate signatures
- [ ] Outbound HTTP requests limited to known third-party APIs
