# Accessibility Checklist — WCAG 2.1 AA

## Automated Testing

Run with axe-core via Playwright:
```ts
import { checkA11y } from 'axe-playwright'
await checkA11y(page, undefined, { runOnly: ['wcag2a', 'wcag2aa'] })
```

Target: zero violations in automated scan.

## Manual Checklist

### Perceivable
- [ ] All images have meaningful `alt` text (decorative images: `alt=""`)
- [ ] Color alone is never the only differentiator (e.g., error states also use icons or text)
- [ ] Text contrast ratio >= 4.5:1 for normal text, 3:1 for large text
- [ ] Videos have captions (if any)
- [ ] Content readable without color (test with grayscale filter)
- [ ] Text resizes up to 200% without content loss

### Operable
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Focus indicator visible on all focusable elements (not just outline: none)
- [ ] No keyboard traps (modal focus managed with focus trap library)
- [ ] Skip navigation link at top of page (`#main-content`)
- [ ] No content that flashes > 3 times per second

### Understandable
- [ ] `lang="en"` on `<html>` element
- [ ] Form fields have associated `<label>` elements
- [ ] Error messages are descriptive (not just "Error")
- [ ] Error messages associated with the field via `aria-describedby`
- [ ] Required fields marked visually and with `aria-required="true"`

### Robust
- [ ] HTML validates (no stray tags, improper nesting)
- [ ] ARIA roles used correctly (no redundant or conflicting ARIA)
- [ ] Custom components (dropdowns, modals, tabs) have correct ARIA patterns
- [ ] Dynamic content updates announced via `aria-live` regions

## Screen Reader Testing
Test with at minimum one screen reader:
- [ ] NVDA (Windows, free)
- [ ] VoiceOver (macOS/iOS, built-in)
- [ ] TalkBack (Android, built-in)

Verify:
- Navigation landmarks announced correctly
- Form labels read when field focused
- Error messages announced when they appear
- Modal announced when opened; background inert
