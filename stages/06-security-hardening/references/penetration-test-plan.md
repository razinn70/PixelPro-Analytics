# Penetration Test Plan

## Scope
- Client-facing web application (React SPA)
- API server (Node.js/Express)
- Authentication flows (Supabase Auth)
- Dashboard application

## Tools

| Tool | Type | Purpose |
|------|------|---------|
| OWASP ZAP | Automated scanner | Spider + active scan for common vulns |
| Mozilla Observatory | Automated | Security headers, TLS, CSP evaluation |
| Burp Suite Community | Manual proxy | Intercept and manipulate requests |
| npm audit | Dependency scan | Node.js CVE detection |
| pip-audit | Dependency scan | Python CVE detection |
| sqlmap | SQL injection | Automated SQLi testing (test DB only) |

## Test Cases

### Authentication
1. Attempt to access protected endpoint without JWT → expect 401
2. Attempt with expired JWT → expect 401
3. Attempt with modified JWT (change role claim) → expect 401 or 403
4. Attempt magic link reuse after expiry → expect failure

### Authorization (Cross-Client Isolation)
1. Log in as Client A user
2. Manually set `client_id` to Client B's UUID in API request
3. Verify 403 response (not Client B's data)
4. Repeat for all endpoints that accept `client_id` parameter

### Input Validation
1. Submit form with XSS payload: `<script>alert(1)</script>` in text fields
2. Verify no script execution; verify CSP blocks it
3. Submit SQL injection payload: `'; DROP TABLE events; --` in query strings
4. Verify parameterized queries prevent execution

### Rate Limiting
1. Send 101 POST requests to `/api/v1/events` within 60 seconds
2. Verify 429 response on request 101+
3. Verify Retry-After header present

### Security Headers
1. Fetch any page with curl: `curl -I https://staging.client.com`
2. Verify: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
3. Run Mozilla Observatory scan

## Pass Criteria
- OWASP ZAP: zero High or Critical findings
- Mozilla Observatory: B+ or higher
- All auth/authz test cases: correct HTTP status returned
- No XSS execution in any browser
- No SQL injection possible
- npm audit + pip-audit: zero High/Critical CVEs
