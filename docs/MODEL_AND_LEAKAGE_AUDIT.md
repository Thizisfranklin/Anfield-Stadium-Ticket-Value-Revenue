# Model and leakage audit

## Question and target

Can a small set of pre-match context features outperform a simple unused-ticket benchmark? Target: published unused home tickets, 2025–26 PL. Only 19 records share the same explicit source scope. Do not pool the older source to inflate sample size without resolving definition equivalence.

## Allowed information

- Weekend flag, scheduled kickoff hour, restricted-ballot eligibility.
- Restricted ballot is explicitly defined from source criteria, including the season's last home match. It is not inferred from results or ticket outcomes.
- Provider schedules are final observed schedules. They may differ from dates known months earlier: this is a near-match benchmark, not an advance-booking backtest.

## Excluded information

Realized forwarding, exchange outcomes, match results, attendance, goals, final league position, betting prices, and any target-derived category labels. Forwarding is available only after behavior occurs and cannot be casually used for advance decisions.

## Evaluation design

Chronological expanding windows: train first 10/13/16 fixtures and test next 3. Nine unique held-out fixtures. No random split; every train end predates every corresponding test fixture. Standardization occurs inside each fitted pipeline. Ridge alpha=10 is fixed; no test-set search. Compare expanding historical mean, last observed fixture, and standardized ridge context. Negative ridge forecasts are clipped at zero; all errors are in tickets.

Observed MAE / RMSE: mean 436.51 / 618.21; last fixture 1,110.11 / 1,197.71; ridge 454.30 / 652.31. No superiority significance claim: only nine held-out records, and results may change with more seasons. There is no deployed model, accuracy percentage, or claimed revenue lift.

The last-fixture baseline is a fixed-origin three-fixture forecast within each fold, not updated between those three fixtures. All models share those forecast origins. Test assertions mutate the final held-out label and verify predictions do not change.

## Forecasting decision

Fixtures are separated by 5–29 days; no regular daily/weekly series exists. Nineteen comparable observations cover one season, insufficient to establish annual seasonality. Stationarity is unknown: a low-power unit-root test would not make this sample adequate. Resampling or interpolating missing calendar weeks would invent observations. Therefore ARIMA/SARIMA and exponential-smoothing time-series experiments are not justified here. Fixture-level benchmarking and descriptive trends answer the available question more honestly.

## Policy / causal discipline

No treatment/control design exists. Every Seat, Every Game overlaps changes in forwarding, Friends & Family limits and anti-touting activity. Match timing, opponent mix and team performance may differ. Matching 16 opponents does not control all this. The bootstrap interval is opponent-resampling sensitivity around a descriptive contrast, not uncertainty about a randomized treatment effect. GA season-ticket −23% is a publisher-reported aggregate, not independently estimated from the fixture table.

Needed next: multiple consistent pre/post seasons, ticket-level gate entry, eligibility and exposure timestamps, policy compliance separate from actual attendance, unaffected comparison groups, and prospectively frozen schedule snapshots. Randomized communication experiments could measure incremental attendance without claiming the entire policy's causal effect.
