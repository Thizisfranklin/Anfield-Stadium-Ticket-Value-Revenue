# ANFIELD MATCHDAY INTELLIGENCE — handoff

Ticket Utilization, Fan Access & Revenue Analytics

## 1. What was built

An executed, source-traceable Anfield case study with a Python analytical pipeline, six executed notebooks, meaningful relational SQL, policy sensitivity analysis, chronological predictive benchmarks, hypothetical supporter-access scenarios, and an original React application. The original inventory/access business question and childhood Liverpool motivation are preserved. This is independent research, not club work or a generic stadium product.

## 2. Repository architecture

- `analysis/`: acquisition, ingestion, validation, policy, modelling, database, notebook and export modules.
- `data/curated/`: explicit source transcriptions; `data/processed/`: fixture table and summaries; raw downloads are ignored.
- `validation/`, `tests/`: contract and analytical tests.
- `sql/`: normalized schema, deterministic seed and four analyses.
- `notebooks/`: six executed narrative notebooks, in reading order.
- `reports/`: statistical results, predictions, SQL outputs, charts and screenshots.
- `app/`: React/Vite static interface and Playwright tests.
- `docs/`: original specification, data contract/dictionary, audits and operational instructions.

The architecture diagram is in README. Python calculates analytical outputs; JavaScript selects and renders them.

## 3. Data sources

Official LFC 2024–25 and 2025–26 ticketing articles link to detailed PDFs. Official 2026–27 matchday prices and March 2026 stadium access documentation supply contextual stand information. The March 2025 policy announcement explains Every Seat, Every Game. Football-Data.co.uk provides dates and kickoff times for Liverpool's home league fixtures.

[DATA_PROVENANCE.md](DATA_PROVENANCE.md) records exact URLs, access date, source grain, transformations and usage notes; `data/source_manifest.json` stores download hashes. Club PDF artwork, crests and photographs are not distributed. No private data or paid access was used.

## 4. Data dictionary

The 38-row fixture table includes season, opponent, competition, date, kickoff, unused tickets, nullable forwarding, source/page, grain and scope. Derived context includes weekend, kickoff hour, restricted-ballot eligibility and unused tickets as a share of physical capacity. Price records are separate 2026–27 categories in GBP. Cup means and membership measures remain aggregates.

See [the full dictionary](docs/DATA_DICTIONARY.md). Never interpret null forwarding as zero.

## 5. Data-grain boundaries

The most important rule is no disaggregation beyond the source. Fixture counts cannot become Kop/Main Stand counts. Cup means cannot become synthetic cup fixtures. Price bands can cover several stands, so an explicit bridge table handles membership. Capacity is not sold inventory. Exact attendance, utilization and exchange conversion cannot be recovered from these publications.

The 2024–25 PDF says all stadium tickets while 2025–26 says home tickets. Keep that caveat with every cross-season unused-ticket comparison until the club clarifies equivalence. Historical pricing links now show 2026–27 prices; do not backfill those into earlier seasons.

## 6. Analytical methods

PyMuPDF extracts numeric tables. The 2025–26 opponent crests were read visually on both relevant pages and reconciled against fixture context. Join keys are normalized season + opponent and must be one-to-one. Validation checks source shapes, counts, duplicate keys, season dates, integer units, null expectations, source rounded means and explicit grain.

EDA reports fixture counts, competition means, weekday/weekend context and member-access denominators. Policy analysis calculates raw differences, a same-opponent subset and a seeded bootstrap. Scenarios apply an explicit successful-recovery fraction to unused ticket counts. No synthetic stand metrics or causal/revenue estimates are generated.

## 7. Statistical and model results

Published unused totals are 27,845 and 28,821, means 1,465.53 and 1,516.89 (scope caveat applies). 2025–26 forwarding averages 9,925.53. Fulham has the largest newer-season league unused count, 2,820. Published cup means are FA Cup 5,556, Carabao Cup 4,298 and Champions League 2,472.

Within the 19 comparable-scope 2025–26 fixtures, train on first 10/13/16 and test next three. Nine distinct test fixtures. Expanding-mean MAE/RMSE is 436.51/618.21; last-fixture 1,110.11/1,197.71; ridge context 454.30/652.31 tickets. The context model does not beat the expanding mean here. No operational readiness or significance claim follows from this tiny sample.

## 8. Policy analysis

The club reports 23% fewer empty GA season-ticket seats after the policy change. That subgroup differs from the broader fixture table, and its raw series is not published here. Do not say the project proved the policy caused a decline.

The raw broader-series difference is +51.37 tickets per fixture (+3.51%), definition-sensitive. Across 16 common opponents the mean difference is −1.625, with a 10,000-resample opponent bootstrap 95% interval from −386.13 to +366.94. The interval reflects opponent resampling, not measurement uncertainty or causal identification. Opponent mix, timing, performance, concurrent rules and source definitions remain concerns. Policy compliance can include a listing or forward, which need not establish gate entry.

## 9. Forecasting decision

No ARIMA/SARIMA or exponential-smoothing time-series model was forced into the project. The consistently defined target has 19 observations at 5–29-day intervals across one season. Annual seasonality and stationarity are not established. Calendar interpolation would manufacture data. Keep the fixture benchmark and collect more consistent seasons before operational forecasting.

## 10. Application walkthrough

Open the local preview or eventual static URL. The short map sequence centers Anfield; **Enter analysis** opens Matchday. Change the season and fixture, or select a chart bar. The unused/capacity ratio is explicitly labelled as context. Open Stadium and select each of the four stands with a pointer or keyboard. Review Inventory flow for the ticket routes, Match context for aggregate comparisons, and Policy review for limitations. In Policy lab change the recovery assumption; every output is a labelled scenario. Model evidence explains benchmark performance; Decision centre ends with experiments and measurement needs. The AMI header returns to arrival.

## 11. Visual design decisions

Original dark navy surfaces, mint data accents, restrained red map marker, condensed typography and generous spacing. Geographic rendering supplies place; the SVG supplies structure without copying an official seating plan. No invented stand heatmap. No club photography, crest assets or copied broadcast interface. Charts have text/table alternatives, stands support Enter/Space, controls have labels, focus is visible and motion respects user preference. Mobile navigation is horizontally scrollable.

## 12. Known limitations

- Two published seasons, only one with fixture forwarding and consistently explicit home-ticket target scope.
- No sold-ticket denominator, complete attendance, exchange listing funnel or ticket-level journey.
- Cup data is competition means without fixture variance in these sources.
- Current pricing cannot establish historical transaction prices, margin or refunds.
- Small observational sample; no causal identification or production forecast.
- Date/kickoff context uses final schedule data, not snapshots known at original sale time.
- Public source URLs can change; hashes and source snapshots need review on refresh.
- Map/fonts are external dependencies; local fallbacks preserve analysis.
- Native PostgreSQL is configured for reproduction/CI; local SQL verification used PostgreSQL WASM, not a native server.
- No comprehensive WCAG certification, all-browser audit, production uptime guarantee or club endorsement.

## 13. Tests performed

28 Python tests passed; all six notebooks executed; four SQL queries matched cell by cell across SQLite and PostgreSQL WASM; Vite production build passed; three Playwright production-browser tests passed. Desktop (1440×1000) and mobile (390×844) were inspected. Browser tests cover navigation, season/fixture updates, keyboard stand selection, scenario control/reset, reduced motion, horizontal overflow and data-load recovery. [Validation record](reports/VALIDATION.md) lists fixes and scope.

## 14. Reproduction steps

Create/activate a Python 3.12 environment and install `requirements.txt`. Run `python -m analysis.acquire`, `python -m analysis.pipeline`, `python -m pytest -q`, then `python -m analysis.notebooks`. In `app`, install locked dependencies with pnpm, build, run `test:postgres`, install Playwright Chromium, and run tests. Preview the production build over HTTP. Exact commands and native PostgreSQL options are in [REPRODUCTION.md](docs/REPRODUCTION.md).

## 15. Deployment instructions

The frontend is static and deployment-ready. No API keys or live database are required. For GitHub Pages, review/merge the PR yourself, choose GitHub Actions in repository Settings → Pages, and run the Pages workflow on main. Use the returned deployment URL. Vercel and Netlify settings are documented in [DEPLOYMENT.md](docs/DEPLOYMENT.md). No public deployment is claimed until a successful URL is verified.

## 16. Verified portfolio claims

Use [VERIFIED_PORTFOLIO_CLAIMS.md](VERIFIED_PORTFOLIO_CLAIMS.md), which separates data facts, model results, policy observations and scenarios. Example scenario: 25% successful recovery of Fulham's 2,820 unused tickets gives 705 additional supporter opportunities and 1.1505 percentage points of physical capacity, not actual uplift or revenue.

## 17. Two résumé bullets

- Built a reproducible Anfield ticketing analytics pipeline integrating 38 official league fixture records with public match context, relational SQL and six executed notebooks; enforced source provenance, one-to-one joins and explicit data-grain boundaries.
- Developed an interactive React/MapLibre stadium case study with policy sensitivity analysis and labelled recovery scenarios; benchmarked three models using chronological validation on nine held-out fixtures and documented why the simple mean baseline outperformed the context model.

## 18. Files and functions to personally understand

1. `analysis/ingest.py::extract`: measurement origins and crest/context reconciliation.
2. `analysis/validation.py::validate_fixtures`, `require_grain`, `percent`, `scenario`: safeguards against misleading numbers.
3. `analysis/policy.py::compare`: matching, bootstrap, and what its interval does not mean.
4. `analysis/modeling.py::evaluate`: chronological splits, fixed features, scaling and baselines.
5. `analysis/pipeline.py::main`: reproducible artifacts and frontend schema checks.
6. `analysis/database.py::populate` and `sql/queries.sql`: relational design and queries.
7. `app/src/Experience.jsx`: view state, fixture selection, scenario lookup and source display.
8. `app/src/Stadium.jsx`, `ArrivalMap.jsx`: original vector interaction and geographic scene.
9. `tests/test_analytics.py`: invalid-input tests, leakage mutation and source reconciliation.
10. `docs/DATA_CONTRACT.md`: the boundary to preserve when extending the project.

## 19. Fifteen interview questions

1. Why is this an inventory/access project rather than a price-prediction exercise?
2. Why doesn't physical capacity minus unused tickets equal attendance?
3. How did you extract opponent labels rendered as crests?
4. What checks protect the fixture join from silent duplication?
5. How does a null forwarding value differ from zero?
6. Why can't cup competition means become individual fixture observations?
7. What does the source population wording change imply for season comparisons?
8. Why can the club's GA season-ticket decline coexist with a higher broader unused-ticket mean?
9. What confounders prevent a causal policy conclusion?
10. What uncertainty does the opponent bootstrap measure, and what does it omit?
11. Why is realized forwarding excluded from pre-match predictive features?
12. How do expanding-window splits prevent temporal leakage?
13. Why did you decide against ARIMA and a deployed future forecast?
14. Why is a recovered unused ticket not automatically incremental revenue?
15. Which additional measurement or experiment would most improve this project?

## 20. Recommended future improvements

First resolve the publisher's population definitions and request consistent subgroup gate-entry series. Collect more seasons and booking-date schedule snapshots. Measure exchange listings, time-to-resale and final attendance. Design a randomized reminder experiment with attendance as the outcome. Add ticket-level cost/refund information before any revenue scenario. Validate model stability and calibrated intervals prospectively. Expand accessibility/browser testing and choose a supported map service if public traffic grows. Keep the Anfield-specific identity and all existing grain protections.
