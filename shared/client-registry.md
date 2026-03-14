# Client Registry

Active clients, configurations, and pipeline status.

## Active Clients

| Slug                | Name               | Vertical  | Domain                        | GA4 ID       | Status | Start Date |
|---------------------|--------------------|-----------|-------------------------------|--------------|--------|------------|
| pixelpro-analytics  | PixelPro Analytics | ecommerce | pixelpro-analytics.vercel.app | G-XXXXXXXXXX | active | 2026-03-14 |

---

## Adding a New Client

After completing Stage 01 onboarding, add a row to the table above:

```
| [slug] | [Business Name] | restaurant / ecommerce / service | [domain] | G-XXXXXXXX | onboarding | YYYY-MM-DD |
```

**Slug rules:**
- Lowercase, hyphen-separated (e.g., `joe-pizza`, `green-clean-services`)
- Max 30 characters
- No spaces or special characters
- Must be unique in this table

**Status values:**
| Status | Meaning |
|--------|---------|
| `onboarding` | Stage 01 in progress |
| `building` | Stages 02–05 in progress |
| `hardening` | Stages 06–07 in progress |
| `active` | Live, monitored, reporting running |
| `paused` | Client on hold (payments, scope pause) |
| `archived` | Engagement ended |

---

## Archived Clients

| Slug | Name | Vertical | End Date | Notes |
|------|------|----------|----------|-------|
| — | — | — | — | — |
