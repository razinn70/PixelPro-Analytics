# Content Security Policy

## Production CSP Header

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

## Directive Explanations

| Directive | Value | Reason |
|-----------|-------|--------|
| `default-src` | `'self'` | Catch-all: only same origin |
| `script-src` | self + GTM + GA | GA4 tag manager required |
| `style-src` | `'unsafe-inline'` | Tailwind inline styles (acceptable tradeoff for SMB projects) |
| `img-src` | self + data + https | Allow CDN images, base64 favicons |
| `connect-src` | self + supabase + GA | API calls and analytics |
| `frame-src` | `'none'` | Prevent iframe embedding (clickjacking) |
| `object-src` | `'none'` | Disable Flash/plugins |
| `upgrade-insecure-requests` | — | Force HTTPS for mixed content |

## Implementation in Vercel

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://www.googletagmanager.com; ..."
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## CSP Testing

1. Deploy to staging
2. Open browser DevTools → Console: look for CSP violation messages
3. Use CSP Evaluator: https://csp-evaluator.withgoogle.com/
4. Use Mozilla Observatory: https://observatory.mozilla.org/
5. Target grade: B+ minimum, A preferred
