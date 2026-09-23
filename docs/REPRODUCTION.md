# Reproduce the project

Reference runtimes: Python 3.12, Node 24, pnpm 11.19.0. Run commands from the repository root except where indicated. No private data or secrets are needed for local reproduction.

```sh
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python -m analysis.acquire
python -m analysis.pipeline
python -m pytest -q
python -m analysis.notebooks
```

`acquire` downloads public sources if missing, checks PDF signatures, and records hashes. `pipeline` extracts, joins, validates, evaluates, creates the figure, exports JSON, and executes the SQLite analytical workflow. `notebooks` rebuilds and executes all six narrative notebooks. Committed outputs allow inspection without running Jupyter.

```sh
cd app
pnpm install --frozen-lockfile
pnpm build
pnpm test:postgres
node node_modules/@playwright/test/cli.js install chromium
pnpm test
pnpm preview --port 4173
```

On Linux CI, use `playwright install --with-deps chromium` as in the workflow. In a restricted filesystem, set `PLAYWRIGHT_BROWSERS_PATH` to a writable local directory before install and test. Browser tests serve the production build, not the development bundle.

## PostgreSQL

The schema is relational: seasons, competitions, fixtures, one-to-one ticketing metrics, stands, price categories and their stand bridge, competition summaries, and policy periods. Queries cover season/competition aggregation, fixture rankings and same-opponent contrasts.

For a new local PostgreSQL database:

```sh
# Set DATABASE_URL using your own local connection; do not commit it.
# PowerShell: $env:DATABASE_URL='postgresql://USER:PASSWORD@localhost:5432/anfield'
# bash: export DATABASE_URL='postgresql://USER:PASSWORD@localhost:5432/anfield'
python -m analysis.database
```

This creates the dedicated `anfield_intelligence` schema and populates it. It intentionally fails if its tables already exist, rather than deleting or replacing existing analytical data. Use a new database/schema for a fresh run, or review any cleanup yourself. SQL can also be run directly in an empty schema, in order: `sql/schema.sql`, `sql/seed.sql`, `sql/queries.sql`.

Local verification executed the SQL under both SQLite and PGlite (real PostgreSQL compiled to WASM) and compared every query cell. It did not require a native server. The CI workflow additionally provisions PostgreSQL 17 and runs the psycopg workflow; distinguish local verification from CI status in the final PR.

## Reading order

Start with notebook 01 and `docs/DATA_CONTRACT.md`, then EDA/context notebooks, policy and model audits, and the scenario notebook. Read `analysis/validation.py` before altering denominators. Frontend code does no statistical fitting; it selects precomputed artifacts.
