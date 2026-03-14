# Stage 02: Database Design

Design the schema extensions for this client, configure RLS policies, and generate migrations.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../01-client-onboarding/output/client-spec.md | "Features" + "KPIs" sections | What data to store |
| Reference | references/schema-patterns.md | Full file | Multi-tenant conventions |
| Reference | references/rls-policies.md | Full file | Row-level security templates |
| Reference | references/migration-conventions.md | Full file | Migration file naming/structure |

## Process

1. Review client spec for data requirements
2. Map features to tables: which client-specific tables are needed beyond core schema
3. Define RLS policies: client can only access their own rows
4. Write migration files (Prisma or raw SQL)
5. Seed test data for development
6. Validate schema against KPI requirements: can every KPI be computed from this schema?

## Audit

| Check | Pass Condition |
|-------|---------------|
| RLS on all tables | Every table with client_id has an RLS policy |
| KPI computable | Every KPI from the client spec can be derived from a SQL query |
| No PII in events | events table schema hashes IPs, stores no names/emails |
| Migration reversible | Every migration has an up and down path |
| Indexes defined | Foreign keys and frequently-queried columns are indexed |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Schema docs | output/schema.md | Table definitions, relationships, RLS policies |
| Migrations | output/migrations/ | SQL or Prisma migration files |
| Seed data | output/seed.sql | Test data for development |

## Handoff
Write `output/schema.md`, `output/migrations/`, `output/seed.sql`. Stage 03 and 04 read from these.
