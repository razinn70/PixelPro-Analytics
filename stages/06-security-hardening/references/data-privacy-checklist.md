# Data Privacy Checklist (PIPEDA / CASL)

## PIPEDA (Personal Information Protection and Electronic Documents Act)

### Consent
- [ ] Cookie consent banner displayed on first visit
- [ ] Analytics tracking does not activate until consent given
- [ ] Consent preference persisted in localStorage (not cookie, ironically)
- [ ] "Decline" option available and functional
- [ ] Consent can be withdrawn: link in footer to cookie settings

### Data Collection Minimization
- [ ] Only collect data necessary for the stated purpose
- [ ] No collection of names, emails, or phone numbers in analytics events
- [ ] IP addresses hashed server-side before storage (never stored raw)
- [ ] User agent stored for debugging only, not profiling

### Data Retention
- [ ] Raw events: retained 13 months (GA4 standard)
- [ ] Daily metrics: retained 3 years
- [ ] Client reports: retained 5 years
- [ ] Session data: purged after 90 days
- [ ] Retention policy documented in client privacy policy

### Data Access
- [ ] Clients can request their data export (contact PixelPro support)
- [ ] No third-party data sharing without explicit consent
- [ ] Supabase data residency: confirm Canadian or US region (PIPEDA allows both if disclosed)

## CASL (Canadian Anti-Spam Legislation)

### Email Marketing (if applicable)
- [ ] Explicit opt-in for marketing emails (double opt-in preferred)
- [ ] Unsubscribe mechanism in every marketing email
- [ ] From address identifies sender clearly
- [ ] Physical mailing address in footer
- [ ] Consent records retained for 3 years after relationship ends

### Transactional Emails
- CASL exemption: order confirmations, account notifications are permitted without explicit consent
- Must still include unsubscribe for any promotional content mixed in

## Privacy Policy Requirements

Client site must link to a privacy policy that covers:
- What data is collected (GA4, custom events, forms)
- Why it is collected (analytics, business improvement)
- Who has access (PixelPro, Google, Supabase)
- How to request data deletion or export
- Contact email for privacy inquiries
- Last updated date

Template: `references/privacy-policy-template.md` (create per client)
