# Coding Standards

## TypeScript
- `strict: true` in all tsconfigs — no exceptions
- Zero `any` types in production code; use `unknown` + type guards if needed
- Interfaces for object shapes, type aliases for unions/primitives
- Barrel exports from `index.ts` in each module
- Zod for runtime validation at system boundaries (API inputs, external data)

## React
- Functional components only — no class components
- Custom hooks for data fetching and side effects
- Props interface co-located with the component file
- No inline styles in JSX — use Tailwind utility classes
- `React.lazy()` + `Suspense` for route-level code splitting

## Python
- Type hints on all function signatures (PEP 484)
- Black for formatting, isort for import ordering
- Docstrings on all public functions (Google style)
- Pydantic for data validation in ETL pipelines
- Virtual environments via `venv` or Poetry; never install globally

## Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Branch naming: `feature/[client-slug]-[description]`, `fix/[issue-number]-[description]`
- PR required before merging to `main`; self-review minimum
- No force-pushing to `main`
- No committing `.env` files — use `.env.example` with placeholder values

## SQL
- All queries parameterized — no string interpolation with user input
- Migrations are forward-only in production; rollback via a new migration
- `snake_case` for all table and column names
- UUID primary keys for all client-facing tables
- BIGSERIAL for high-volume append-only tables (events, funnel_events, daily_metrics)
- Every foreign key column must have an index

## File & Folder Naming
- React components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities/lib: `camelCase.ts`
- Data/config files: `camelCase.ts` or `kebab-case.json`
- Directories: `kebab-case`

## Code Review Checklist
- [ ] No `any` types
- [ ] No hardcoded secrets or environment values
- [ ] No raw SQL string concatenation
- [ ] Analytics events fire on all new funnel steps
- [ ] New API endpoints have auth middleware applied
- [ ] New tables have RLS enabled and policies defined
