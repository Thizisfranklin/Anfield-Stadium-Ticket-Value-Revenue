# Verified portfolio claims

Generated from executed pipeline outputs on 2026-09-23. Source grain and caveats are part of each claim.

## DATA FACTS

- Extracted and validated **38 Premier League fixture records**, 19 in each of 2024–25 and 2025–26, joining public LFC ticketing data one-to-one to Football-Data fixture context.
- Published unused-ticket rows sum to **27,845** in 2024–25 and **28,821** in 2025–26; means are **1,465.53** and **1,516.89**. Population wording differs (all stadium vs home tickets), so these are not a verified like-for-like occupancy comparison.
- 2025–26 published forwarding averages **9,925.53** tickets over 19 home league matches. Fixture-level forwarding for 2024–25 is not available.
- The largest 2025–26 published unused-ticket count is **2,820, Fulham**.
- Published 2025–26 cup unused-ticket means are FA Cup **5,556**, Carabao Cup **4,298**, Champions League **2,472**. These are competition means, not reconstructed cup fixture rows.
- The club's physical capacity is **61,276**. Exact sold-ticket utilization and attendance are not established by these sources.

Evidence: `data/processed/fixtures.csv`, source pages listed in `DATA_PROVENANCE.md`, `data/curated/context.json`.

## MODEL RESULTS

- Executed three fixed-specification models over three chronological expanding windows, with **nine unique held-out fixtures** from 2025–26.
- Expanding-mean baseline: **MAE 436.51**, **RMSE 618.21 tickets**.
- Last-fixture baseline: **MAE 1,110.11**, **RMSE 1,197.71 tickets**.
- Ridge context: **MAE 454.30**, **RMSE 652.31 tickets**. It did not improve the mean baseline in this small evaluation.
- No production forecasting performance, causal uplift, or predictive accuracy percentage is claimed. ARIMA was rejected on sample-size, regularity and seasonality grounds.

Evidence: `reports/model_results.json`, `reports/model_predictions.csv`, executed notebook 05.

## POLICY OBSERVATIONS

- The club reports **23% fewer empty GA season-ticket seats** in 2025–26 after the policy introduction. This is an attributed subgroup observation, not a causal estimate independently derived here.
- Raw published-series change is **+51.37 tickets per fixture (+3.51%)**, subject to unconfirmed scope comparability.
- Among **16 common opponents**, mean after-minus-before difference is **−1.625 tickets**. Seeded 10,000-resample opponent bootstrap 95% interval: **−386.13 to +366.94**. It does not address measurement uncertainty, confounding or policy causality.

Evidence: `reports/policy_results.json`, executed notebook 04; official 2025–26 PDF p11.

## SCENARIO RESULTS

- **SCENARIO — NOT OBSERVED DATA:** recovering and using 25% of Fulham 2025–26's 2,820 unused tickets yields **705 additional supporter opportunities**, **2,115 remaining unused tickets**, and **1.1505 percentage points of physical capacity recovered**.
- This is arithmetic under an explicit assumption, not observed attendance, a behavioral forecast, or incremental revenue.

Evidence: `analysis.validation.scenario`, executed notebook 06, exported fixture scenario grid.

## Claims that must not appear on a résumé

Do not claim increased Liverpool revenue, reduced no-shows in practice, a causal policy effect, stand-level utilization insights, production deployment within the club, reliable future forecasts, or 90%/95% model accuracy.
