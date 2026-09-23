# Validation record

Local execution date: 2026-09-23. Reference environment: Windows, Python 3.12, Node 24.19, pnpm 11.19.0. Dependency versions are locked. GitHub CI status is separate from this local evidence.

| Check | Executed result |
|---|---|
| Acquisition | Two LFC ticketing PDFs, two league CSVs, official access PDF and current price image downloaded; hashes recorded |
| Source reconciliation | 19 unused-ticket rows each season; 19 forwarding rows in 2025–26; rounded means 1,466 / 1,517 / 9,926 match publications |
| Curated evidence | Crest order on both 2025–26 tables visually inspected; price table visually transcribed; no club artwork redistributed |
| Python pipeline | Extraction, context join, policy/bootstrap, model evaluation, figure, scenarios and JSON export executed |
| Analytical tests | 28 passed: malformed source/record checks, duplicate fixtures, nulls, season mapping, units, joins, grain, percentages, scenarios, split leakage, frontend schema, SQL consistency |
| Notebooks | All six generated and executed successfully with saved outputs |
| SQL | Schema, foreign-key load and four queries executed in SQLite and PGlite PostgreSQL WASM; every output cell reconciled |
| Native PostgreSQL | Workflow supplied via psycopg; CI provisions PostgreSQL 17. No local native PostgreSQL server was available |
| Frontend | Production build successful; separate lazy-loaded map chunk; raw datasets excluded |
| Browser tests | Seven passed against production build: desktop/mobile journeys, keyboard chapter navigation at 320px, fixture highlight/tooltips, cup empty state, map/data failure, font fallback and loading recovery |
| Visual inspection | Arrival and all eight pages inspected at 1440px and 390px; final screenshots and page findings in PRODUCT_VISUAL_QA.md |
| Integrity | No stand-level utilization generated; unavailable forwarding stays null; every scenario explicitly labelled; no revenue estimate |

## What was fixed during verification

- PDF forwarding extraction initially captured the season label from the neighboring headline. Anchoring after the forwarding row label isolates the 19 values; published mean reconciliation confirms the result.
- Vite's default configuration bundler encountered a Windows filesystem traversal restriction. The checked-in scripts use Node 24's native configuration loading.
- The initial JSON Schema had a missing closing brace; corrected before passing schema tests.
- MapLibre's loaded stylesheet overrode the map container's absolute positioning. A scoped sizing rule restored the map; the final screenshot shows the Anfield marker over geographic tiles.
- Mobile fixture labels overlapped; adaptive tick spacing retains legibility while the accessible table preserves every value.
- Browser selectors were narrowed to the labelled combobox role and visible metric to avoid matching hidden table text.

## Practical limits

This is functional and visual verification, not a complete accessibility audit. Browser coverage is Chromium at 1440×1000, 390×844 and 320×740, with reduced motion checked on mobile. Map and font availability can vary; no uptime claim is made. External source links were accessed during acquisition/research, but future link stability is outside this repository's control. PGlite validates PostgreSQL SQL execution, not production server performance, credentials, backups or deployment operations.

## Final product pass

See [PRODUCT_VISUAL_QA.md](PRODUCT_VISUAL_QA.md) for page-by-page findings, exact presentation changes and updated screenshots. The analytical code, data exports, notebooks, SQL and VERIFIED_PORTFOLIO_CLAIMS.md were unchanged by this pass; all 28 analytical regression tests passed again.
