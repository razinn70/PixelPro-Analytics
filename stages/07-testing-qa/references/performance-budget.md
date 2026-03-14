# Performance Budget

## Lighthouse Targets

| Page Type | Performance | Accessibility | SEO | Best Practices |
|-----------|------------|---------------|-----|----------------|
| Client site (homepage) | 90+ | 90+ | 90+ | 90+ |
| Client site (inner pages) | 85+ | 90+ | 85+ | 90+ |
| Dashboard | 85+ | 90+ | N/A | 90+ |

## Core Web Vitals Targets

| Metric | Target | Definition |
|--------|--------|------------|
| LCP (Largest Contentful Paint) | < 2.5s | Time to main content visible |
| FID / INP (Interaction to Next Paint) | < 200ms | Responsiveness to input |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TTFB (Time to First Byte) | < 600ms | Server response time |
| FCP (First Contentful Paint) | < 1.8s | Time to first paint |

## Bundle Size Limits

| Bundle | Target | Hard Limit |
|--------|--------|------------|
| Initial JS (gzipped) | < 150KB | 200KB |
| CSS (gzipped) | < 30KB | 50KB |
| Total page weight (images + assets) | < 1MB | 2MB |

## API Latency Targets

| Endpoint type | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| Simple data fetch (metrics, funnels) | < 80ms | < 200ms | < 500ms |
| Report generation | < 2s | < 5s | < 10s |
| Event ingestion | < 50ms | < 150ms | < 300ms |

## Image Optimization Rules
- Convert all images to WebP or AVIF format
- Serve responsive images via `<img srcset>` or `<picture>`
- Lazy load images below the fold (`loading="lazy"`)
- Max single image file size: 200KB (photography), 50KB (UI/icons)
- Use Next/Image or Vite image plugin for automatic optimization

## Bundle Optimization Rules
- Code splitting: lazy load routes with `React.lazy()`
- Tree shake all imports (named imports from `@pixelpro/ui`, not default)
- Analyze with `npx vite-bundle-analyzer` before release
- Target < 3 render-blocking resources in `<head>`
