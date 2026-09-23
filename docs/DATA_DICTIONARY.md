# Data dictionary

## `data/processed/fixtures.csv` (38 rows)

| Field | Type / unit | Meaning |
|---|---|---|
| id | string | Stable season + source-row identifier; not a provider match ID |
| season | string | `2024-25` or `2025-26` |
| opponent | string | Normalized away opponent; Liverpool is always home |
| competition | string | Premier League only at fixture grain |
| unused_tickets | integer tickets | Published sold tickets not used; scope field is mandatory |
| forwarded_tickets | nullable integer tickets | Published GA forwarding in 2025–26; null for every 2024–25 fixture |
| grain | enum | Always `fixture` |
| scope | enum | `all_stadium_tickets` (2024–25 wording) / `home_tickets` (2025–26 wording) |
| source / source_page | string / integer | Local source filename and 1-based PDF page for unused tickets |
| forwarding_source_page | nullable integer | PDF p8 where forwarding is published |
| unused_capacity_pct | percentage | `100 × unused_tickets / 61276`; not occupancy or a sold-ticket no-show rate |
| date | ISO date | Football-Data fixture date |
| kickoff | HH:MM | Provider-listed UK local kickoff time |
| weekend | boolean | Saturday or Sunday based on fixture date |
| weekday | string | Day name |
| kickoff_hour | hours | Hour + minute/60; no outcome information |
| restricted_ballot | boolean | Six named opponents plus last home league game, based on published ballot criteria; not a subjective importance label |

## Other artifacts

`data/curated/context.json` contains cup means at season × competition grain, member application/success percentages at season grain, the 2024–25 mean member exchange purchase count, physical capacity, and stand structure/access facts. Each ticket aggregate includes source filename/page. Stand facts come from the official March 2026 access statement pp1 and 6.

`data/curated/prices.csv` has 12 price bands, listed stand memberships, season `2026-27`, and four GBP prices (`adult_gbp`, `over65_gbp`, `young_adult_gbp`, `junior_gbp`). Age eligibility and special band eligibility should be checked with the club; these are not estimates of average realized prices. Bands can span stands; their counts are not stand capacity.

`reports/model_predictions.csv` records model, expanding-window cutoff, training end, test date, fixture ID, actual target and prediction in tickets. Test outcomes never train their own predictions.

`reports/policy_results.json` includes raw descriptive means, absolute/relative differences, the 16-opponent paired comparison, seeded opponent bootstrap interval, and the separately attributed subgroup observation.

`app/public/data/intelligence.json` combines validated display artifacts. Each fixture has 21 scenarios (0–100% recovery in 5-point steps) computed in Python. `additional_opportunities` and `remaining_unused` are expected ticket counts; `capacity_percentage_points` is recovered tickets divided by physical capacity times 100. Scenario records always carry `SCENARIO — NOT OBSERVED DATA`. No revenue field exists.
