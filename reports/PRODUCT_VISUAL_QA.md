# Final product and visual QA

Executed 2026-09-23 against the local production build at `http://127.0.0.1:4173/`.

## Outcome

The experience now follows a deliberate reading path: **Merseyside / Liverpool → Anfield arrival → Stadium → Matchday → Inventory flow → Match context → Policy review → Policy lab → Model evidence → Decision centre**. The sidebar still permits direct exploration; chapter controls support a continuous story.

This is a presentation pass. No analytical conclusions, input data, exported metrics, model scores, policy estimates or scenario calculations changed. `git diff` confirmed no changes to `analysis/`, `data/`, `validation/`, `sql/`, `notebooks/`, `tests/`, `app/public/data/` or `VERIFIED_PORTFOLIO_CLAIMS.md`.

## Page-by-page review

| Screen | Finding and action | Final evidence |
|---|---|---|
| Arrival | Mobile overlay obscured the geography. Gave the map a dedicated 235px frame; retained a restrained desktop perspective. Removed the abrupt left edge of the desktop map, aligned the marker's dot (rather than the combined dot/label box) with Anfield, and shortened fly-to from 2.6 to 2.2 seconds after a 350ms delay. Reduced motion jumps directly to Anfield. Entry remains available immediately. | [Desktop](figures/arrival-desktop.png), [mobile viewport](figures/arrival-mobile.png) |
| Stadium | Previously skipped on entry. Now chapter 01; larger stand labels and an explicit selected-stand caption reinforce interaction. Four original stand polygons remain keyboard operable with visible hover/focus/selection. The panel shows only tiers, access and dated price categories. | [Stadium](figures/stadium-desktop.png) |
| Matchday | All bars previously looked identical and generic tooltips lacked fixture context. Selected match is amber; tooltips name opponent/date/season and identify ticket counts/source page. Added a count label and selected-match key. Mobile metrics use readable rows instead of compressed columns. | [Desktop](figures/matchday-desktop.png), [mobile](figures/matchday-mobile.png) |
| Inventory flow | Equal cards and a loose dashed line did not clearly connect the routes. Added a labelled branch junction and connectors; mobile stacks routes along one guide. The diagram remains explicitly structural, not a measured Sankey. | [Inventory](figures/inventory-desktop.png) |
| Match context | Scatter tooltips did not name opponents; competition figures lacked nearby citations. Added fixture-aware tooltips, count labels, league-specific weekday heading and direct PDF references beside competition means. Checked the unreported 2024–25 cup state. | [Context](figures/context-desktop.png) |
| Policy review | Kept the club-reported subgroup observation separate from the definition-sensitive overall contrast. Larger explanatory type and mobile metric rows improve reading; uncertainty and confounders remain prominent. No causal claims added. | [Policy](figures/policy-desktop.png) |
| Policy lab | Removed implementation jargon from the introduction. Added a labelled amber recovery/remaining strip tied to the selected assumption. Preserved the explicit scenario badge, precomputed counts, no-revenue explanation, reset and theoretical upper bound. | [Scenario](figures/scenario-desktop.png) |
| Model evidence | Retained the small, honest benchmark table rather than adding decorative charts. Improved surrounding type and navigation; checked the full table at 320px with fallback fonts. The no-ARIMA decision and leakage boundary are unchanged. | [Models](figures/model-desktop.png) |
| Decision centre | Replaced the repeated generic page introduction with a decision-focused one; retained four actionable research questions and measurement needs. The story now ends with an explicit route back to the stadium. | [Decisions](figures/decisions-desktop.png) |

## Cross-cutting changes

- Reordered the first two chapters, added page-specific introductions, chapter numbering, previous/next controls and heading focus after navigation. Replaced the generic “intelligence room” sidebar label with “From seat to supporter.”
- Increased explanatory, citation, caption and metric-detail typography. Kept restrained navy/mint/amber, original stadium geometry and a small geographic red marker; no borrowed broadcaster or club assets.
- Removed unused chart imports and disabled decorative bar/scatter animation. Native controls, keyboard stand selection, visible focus and accessible chart tables remain available.
- Styled the immediate loading state consistently with the product and retained a usable reload action. A missing tile no longer immediately declares the whole basemap unavailable; the fallback appears if no tile loads within seven seconds.
- Captured arrival and every chapter at desktop and mobile sizes. Mobile map screenshots use the actual viewport: Chromium's full-page WebGL capture produced a compositor artifact even though viewport rendering and marker bounds were correct. The checked-in mobile arrival image shows the actual rendered viewport.

## Executed checks

- **Production build passed** with Vite. The existing lazy MapLibre chunk remains the largest asset (~286 kB gzip); Vite reports its size warning. No raw analytical dataset or new image asset is shipped to the app.
- **28 analytical tests passed again.** No statistical code was modified.
- **7 Playwright tests passed** against the production build:
  1. Desktop arrival, stadium-first entry, heading focus, fixture controls, keyboard stand selection and scenario/reset behavior.
  2. Every chapter at 390px with reduced motion and no horizontal page overflow.
  3. Data-fetch failure with reload recovery.
  4. Amber selected fixture, bar-to-fixture linking, opponent-aware bar/scatter tooltips, and unavailable cup evidence.
  5. Map-tile failure, readable fallback and reachable analysis.
  6. Full keyboard chapter journey at 320px with external fonts blocked; space-key stand selection and no horizontal page overflow.
  7. Immediate loading status followed by successful entry once data arrives.
- Manually inspected all eight desktop and mobile chapter renders, both arrival modes, source/scenario labels and the original stand geometry.
- The stand component receives only `stands`, `selected` and `onSelect`; no fixture metric is attached to a stand. Match/cup/subgroup distinctions and unavailable values remain explicit.

## Reproduce the visual review

Build and start the preview using the README commands. From `app/`:

```sh
pnpm test
node scripts/visual-review.mjs ../work/visual-review
```

The capture script writes arrival plus eight numbered pages at 1440×1000 and 390×844; screenshots are review artifacts, not pixel-golden tests. The browser suite also tests 320×740. On this Windows setup `PLAYWRIGHT_BROWSERS_PATH` pointed to the repository's ignored `work/browsers` directory.

## Scope and remaining limits

This pass is Chromium-based visual and functional QA, not a complete WCAG audit or cross-browser certification. External tiles and web fonts depend on third-party availability; data exploration works when the map fails and system fonts remain usable. There is no public deployment claim. Analytics, causal limitations and all verified portfolio claims remain as documented before this pass.
