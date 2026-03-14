# Stage 06: Security Hardening

Audit and harden the full stack against OWASP Top 10 and Canadian privacy requirements.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Frontend | ../03-frontend-build/output/ | Full project | Client app to audit |
| Backend | ../04-backend-build/output/ | Full project | API to audit |
| Dashboard | ../05-dashboard-build/output/ | Full project | Dashboard to audit |
| Config | ../../_config/security-policy.md | Full file | Security requirements |
| Reference | references/owasp-top10-web.md | Full file | Vulnerability checklist |
| Reference | references/csp-policy.md | Full file | CSP rules |
| Reference | references/data-privacy-checklist.md | Full file | PIPEDA/CASL basics |
| Reference | references/penetration-test-plan.md | Full file | Scan methodology |

## Process

1. Input validation: Verify all user inputs sanitized server-side
2. Authentication audit: JWT validation on every protected endpoint
3. Authorization audit: RLS policies enforce client isolation
4. CSP hardening: strict CSP headers, remove unsafe-inline/unsafe-eval
5. Dependency audit: npm audit and pip audit, fix high/critical
6. HTTPS enforcement: HSTS headers, no mixed content, secure cookies
7. Rate limiting verification: test all endpoints under load
8. Data privacy: no raw PII in events, logs, error messages; verify IP hashing
9. PIPEDA basics: cookie consent banner, data retention policy documented
10. Security scan: OWASP ZAP or Mozilla Observatory against staging

## Audit

| Check | Pass Condition |
|-------|---------------|
| Zero SQL injection | All queries parameterized |
| Zero XSS | No innerHTML with external data; CSP blocks inline scripts |
| RLS isolation | Client A cannot access Client B's data |
| Dependencies clean | Zero high/critical vulnerabilities |
| CSP strict | No unsafe-inline or unsafe-eval in production headers |
| Observatory score | Mozilla Observatory B+ or higher |
| No PII leaks | grep returns zero for raw email/phone/IP in logs and errors |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Hardened build | output/ | Security-patched projects |
| Security report | output/security-report.md | Checklist with pass/fail, CVEs, scan results |

## Handoff
Write outputs to `output/`. Stage 07 tests the hardened build.
