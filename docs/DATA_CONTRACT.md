# Analytical data contract v1

Frozen after source inspection on 2026-09-23. Changes require validation and documentation.

| Entity | Grain | Unit | Supported scope |
|---|---|---|---|
| fixtures | season × home opponent × competition | one fixture | 19 PL fixtures each season |
| unused_tickets | fixture | integer tickets | 2024–25 PDF says all tickets in stadium; 2025–26 says home tickets; scope equivalence unconfirmed |
| forwarded_tickets | fixture | integer tickets | 2025–26 PL only; 2024–25 null, never zero |
| cup_summary | season × competition | mean tickets per game | 2025–26 only for unused/forwarding |
| member_access | season × metric | percent or mean tickets | denominators are explicit; not fixture records |
| prices | publication season × category | GBP per ticket | current 2026–27 context only; never joined to historical fixtures |
| stands | stand | tiers, access context | structural facts; no attendance or forwarding |
| policy_observation | season × eligible group | percent change | club-reported GA season-ticket non-attendance decline; no fixture breakdown |
| scenarios | fixture × assumed recovery percentage | expected ticket opportunities | hypothetical, not observed; no incremental revenue |

Capacity 61,276 is physical capacity, not tickets sold. Unused / capacity is labelled **unused tickets as % of physical capacity**, never no-show rate or occupancy. Exact sold inventory, turnstile attendance, exchange listings, exchange conversion and ticket-level paths are unavailable.

Never expand cup means into fixture rows. Never join fixture measures onto stands. Never use allocation percentages to manufacture sold-ticket denominators. Forwarding and unused counts can overlap and cannot be summed as exclusive flows. Initial and final allocations do not identify transition paths.

Dates and kickoff times are joined one-to-one from Football-Data.co.uk by season and normalized home opponent. Results/odds are discarded. Times are provider-listed UK local time. Observational season differences are definition-sensitive, not causal effects.
