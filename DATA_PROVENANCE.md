# Data provenance

All sources accessed **23 September 2026**. Raw downloads are reproducible through `python -m analysis.acquire`; URL, byte length and SHA-256 are recorded in [data/source_manifest.json](data/source_manifest.json). Club PDF artwork and pricing images are kept locally in ignored `data/raw/`, not redistributed in the app. The repository contains extracted factual measurements and attribution, not the club's visual design.

## Primary ticketing sources

| Source / URL | Season | Original granularity and fields | Transformation / validation |
|---|---|---|---|
| [LFC 2024–25 publication](https://www.liverpoolfc.com/news/liverpool-fc-matchday-ticketing-data-2024-25-season), linking to [detailed PDF](https://drive.google.com/file/d/1eS8BnI8QpBdjSiwhaVb3Vh-vuqTFlVef/view) | 2024–25 | p2 capacity and season allocation percentages; p3 member sale proportions; p4 mean member access routes; p5 19 PL fixture non-attendance counts; p6 cup allocation means | PyMuPDF text extraction of p5; opponent-name/value regex requires 19 rows. Recomputed mean rounds to the published 1,466. Curated member and exchange facts retain page references. Cup allocation figures are not used as attendance. |
| [LFC 2025–26 publication](https://www.liverpoolfc.com/news/lfc-matchday-ticketing-data-2025-26-season), linking to [detailed PDF](https://drive.google.com/file/d/10GcbSS106KbP7nbyPy-T0ONkCeqfsGMU/view) | 2025–26 | p3 initial allocations; p4 final ownership; p6 member sales; p7 19 home non-attendance counts; p8 19 forwarding counts; p9 cup sales; p10 competition mean ticket use; p11 policy observations | Numeric rows extracted from pp7–8. Opponent crests visually checked in rendered pages, recorded in `data/curated/opponent_order_2025.json`. Both arrays must have 19 values. Rounded means reconcile to 1,517 and 9,926. Cup mean counts and policy observation are separately curated at published grain. |

These PDFs are official because they are linked directly from LFC's publications; hosting on Google Drive does not change that provenance. No authentication or private data was used.

**Scope caveat:** the 2024–25 PDF describes non-attendance across all stadium tickets; the 2025–26 PDF describes home tickets. The public news articles use broader wording. Until clarified by the publisher, equivalence is unconfirmed. The app keeps the source wording and labels season contrasts as definition-sensitive. Neither PDF supplies exact match-level sold-ticket denominators or complete turnstile attendance.

**Other comparability issues:** p9 of the newer PDF explains that the prior cup ACS report showed final owners while the newer table uses ACS purchasers/participants. Hospitality categorization also changed on p3. Neither is treated as a consistent longitudinal allocation series. Rounded allocation percentages are not converted into exact inventories or quantitative ticket transitions.

## Official pricing, policy and stadium context

| Source / URL | Season / date | Original grain / fields | Transformation and limitations |
|---|---|---|---|
| [Official PL prices page](https://www.liverpoolfc.com/tickets/lfc-ticket-prices) and [linked price image](https://contentfulproxy.stadion.io/rm6ms1yxue4m/6urmetpVhkTC2F4sUe38Bx/10f171bd080e1ebe5ba8aa93595d76c7/2026-2027_Anfield_Ticket_Prices-PL_mbm_.jpg) | 2026–27 | Price category × listed stand(s) × age category, GBP per matchday ticket | All 12 rows visually transcribed into `data/curated/prices.csv`. Source header says “tier”; stored as `band` to avoid confusing price categories with physical tiers. Multi-stand categories use an explicit bridge table. Main Stand Upper band 12 retains Main Stand mapping. Special eligibility is not inferred. This current table is never joined to historical ticketing records. |
| [2024–25 price announcement](https://www.liverpoolfc.com/news/ticketing-update-2024-25-premier-league-season) | 2024–25 | Announcement and links to prices | Historical matchday link now redirects to current 2026–27 pricing. Historical stand prices not recovered or invented. |
| [2025–26 price freeze](https://www.liverpoolfc.com/news/lfc-freezes-general-admission-and-season-ticket-prices-2025-26-season) | 2025–26 | Club-wide policy, including junior/local price context | Used to understand historical pricing context; not enough to reconstruct historical stand-level rates. |
| [Every Seat, Every Game announcement](https://www.liverpoolfc.com/news/season-ticket-renewals-confirmed-new-every-seat-every-game-initiative) | Announced March 2025; effective 2025–26 | GA season-ticket usage policy; 15 home league games; exchange/forwarding compliance rules | Narrative policy context only. Compliance and physical attendance distinguished. Original announcement rules are dated, not presented as a current ticketing guide. |
| [Official access statement](https://backend.liverpoolfc.com/sites/default/files/2026-03/Access_Statement_-_LATEST__March_5a6934336def9e01eeef96e550620350.pdf) | March 2026 | Stadium capacity, four stands and physical tiers (p1); accessible drop-off locations (p6) | Stand facts curated in `context.json`; original schematic independently drawn. No official map artwork reused. Capacity 61,276 reconciles with both ticketing PDFs. |

LFC material is copyrighted; public access does not imply an open-data license. No explicit open license was found. Use is attributed, limited factual extraction for independent noncommercial portfolio research. Raw source documents remain with the publisher; review permission requirements for commercial reuse. This is not a legal opinion or a club-endorsed project.

## Secondary fixture source

| Source / URL | Season | Original grain / fields | Transformation / usage notes |
|---|---|---|---|
| Football-Data.co.uk [2024–25 CSV](https://www.football-data.co.uk/mmz4281/2425/E0.csv), [2025–26 CSV](https://www.football-data.co.uk/mmz4281/2526/E0.csv), [provider](https://www.football-data.co.uk/englandm.php) | Both study seasons | All league matches; dates, provider-listed kickoff times, teams, results, statistics and betting fields | Keep only Liverpool home date/time/opponent. Discard results, odds and other post-match fields. Normalize six opponent aliases, join on season + opponent with one-to-one validation. No unmatched records accepted. Dates parsed day-first; kickoff is UK local provider time, not converted to UTC. Free public CSV access; no blanket open-data redistribution license assumed. Only the 38 joined context records are committed. |

## Geography and visual resources

MapLibre renders standard [OpenStreetMap](https://www.openstreetmap.org/copyright) raster tiles with on-map attribution. OSM geographic data is under ODbL; tile service use follows its [usage policy](https://operations.osmfoundation.org/policies/tiles/). No bulk tile download, prefetching or offline tile cache is implemented. Anfield marker is an approximate presentation coordinate (53.4308, −2.9608), not a survey measurement. No nearby landmark statistics enter analysis. Map failure leaves the analysis usable.

Typography uses Google Fonts' Barlow Condensed and Inter with system fallbacks. The stadium vector, UI and chart styling are original; no club crest, photography, EA or broadcast assets ship in the application.

## Reproduction and source drift

Run acquisition on a fresh `data/raw/` directory to redownload; existing snapshots are reused intentionally. Compare SHA-256 hashes with the committed manifest when reproducing the original run. Public providers may revise files. Do not silently overwrite the provenance of a changed source: review extraction, rerun all validations and update the manifest/results together. Curated facts are explicit source transcriptions and must be visually rechecked if the corresponding source changes.
