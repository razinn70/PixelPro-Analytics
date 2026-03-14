# Build Conventions

## Project Structure (per client app)

```
apps/clients/[client-slug]/
├── src/
│   ├── pages/              # Route-level components
│   │   ├── Home.tsx
│   │   ├── [Vertical].tsx  # Menu, Shop, Services, etc.
│   │   └── Contact.tsx
│   ├── components/         # Client-specific components not in shared library
│   ├── data/               # Static data files (menu items, services, etc.)
│   │   └── content.ts
│   ├── hooks/              # Client-specific hooks
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── lib/
│   │   ├── analytics.ts    # Client-specific event config
│   │   └── api.ts          # API client with base URL
│   ├── App.tsx             # Router + providers
│   └── main.tsx            # Entry point
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Data: `camelCase.ts` or `kebab-case.json`
- Types: `types/index.ts` (barrel)

## TypeScript Rules
- `strict: true` in tsconfig
- Zero `any` types
- Interfaces for object shapes, types for unions/primitives
- Props interface co-located with component:
  ```tsx
  interface ButtonProps {
    variant: 'primary' | 'secondary'
    children: React.ReactNode
    onClick?: () => void
  }
  export function Button({ variant, children, onClick }: ButtonProps) { ... }
  ```

## Import Order
1. React + third-party libraries
2. `@pixelpro/ui` (shared library)
3. Local components
4. Local hooks, utilities, types
5. Assets

## Content / Copy Rules
- Never hardcode copy in JSX. Put all text in `src/data/content.ts`:
  ```ts
  export const content = {
    hero: {
      headline: "Best Pizza in Guelph",
      subhead: "Fresh ingredients, fired daily."
    }
  }
  ```
- Use `content.hero.headline` in JSX, not raw strings

## Tailwind Configuration
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#CLIENT_COLOR_PRIMARY',
        accent: '#CLIENT_COLOR_ACCENT',
        dark: '#CLIENT_COLOR_DARK',
      }
    }
  }
}
```
Always extend, never replace. PixelPro base tokens remain available.

## Responsive Breakpoints
- Mobile first: styles at 320px base
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1440px

Test at: 320, 768, 1024, 1440px.
