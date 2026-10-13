# Anfield Matchday Intelligence

<p align="center"><img src="https://backend.liverpoolfc.com/sites/default/files/styles/lg/public/2024-06/lfc-digital-crest-story-23062024.webp?itok=g5u5mxnB&amp;width=1680" width="125" alt="Liverpool FC Liver Bird"></p>

<p align="center"><strong>Ticket Utilization · Supporter Access · Matchday Analytics</strong></p>

<p align="center"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><strong>Explore the Interactive Project ↗</strong></a></p>

**A sold-out stadium. An unused ticket. Someone still trying to get in.**

Liverpool FC plays at one of football's most in-demand grounds, yet published ticketing reports record thousands of unused tickets across a Premier League season. For supporters who struggle to attend, that raises a practical question: **Can better analysis of ticket utilization, forwarding, and matchday patterns help identify opportunities to improve attendance and supporter access?**

**Anfield Matchday Intelligence** is an independent sports analytics study built from Liverpool FC's public ticketing reports for the **2024–25 and 2025–26 Premier League seasons**. I combined official ticketing figures with fixture information to examine non-attendance, ticket redistribution, forecasting performance, and possible recovery scenarios. An interactive website connects the analysis to the decisions a club might need to consider.

This is **not a project commissioned by Liverpool FC**, a live ticketing platform, or a claim that unused tickets are all unsold inventory.

## What the analysis revealed

The validated dataset covers **38 Premier League home fixtures**, 19 in each season. Four findings shape the project:

| Question | What the evidence shows |
| --- | --- |
| **How many tickets went unused?** | Liverpool's published reports record **27,845** unused tickets in 2024–25 and **28,821** in 2025–26, approximately **1,500 per home fixture** in each season. The reporting populations differ, so this is **not a verified like-for-like trend**. |
| **What role does forwarding play?** | For 2025–26, the club reports an average of approximately **9,926 forwarded tickets per Premier League home match**. Forwarding is not itself evidence of stadium entry. |
| **Can unused tickets be forecast?** | Across **nine held-out 2025–26 fixtures**, an expanding historical average had a mean absolute error of **437 tickets**, slightly below Ridge regression's **454**. More complexity did not improve this small evaluation. |
| **What could recovery mean for access?** | One Fulham fixture had **2,820** published unused tickets. If a *hypothetical* process recovered and successfully used **25%**, that would provide **705 additional supporter opportunities**—not a measured policy result. |

### The main takeaway

The analysis helps establish the scale of published unused-ticket counts and the limits of forecasting from public records. It also exposes a **data gap**: knowing that a ticket was allocated, forwarded, exchanged, or marked unused does not reveal the complete journey from its original holder to actual stadium entry.

**Better utilization decisions require more than predicting unused tickets. They require knowing whether redistribution actually results in more occupied seats and better access for supporters.**

That is the direction this project explores: moving from describing non-attendance toward understanding the information and evidence needed to evaluate possible interventions.

## Why I made this

I've supported Liverpool since I was around five. Like many supporters, I've experienced how difficult access to tickets can feel. Seeing published evidence of unused tickets made me curious about what happens *around* the match rather than trying to predict match results.

I wanted to bring together data analysis, forecasting, and an accessible interactive experience to investigate a problem that matters to supporters while staying honest about what publicly available data can and cannot establish.

## Understanding Anfield and its ticketing system

Liverpool FC competes in the **Premier League**, the top division of English football. Its home stadium, **Anfield**, has a published physical capacity of **61,276 seats**. Tickets may be purchased or allocated well before kickoff, but a holder may ultimately be unable to attend.

Liverpool offers mechanisms such as **ticket forwarding** and its **Ticket Exchange**, which can help move access from one supporter to another. However, a forwarded or exchanged ticket is not automatically the same as a person passing through the turnstile. A matchday seat is also perishable inventory: once the match ends, that particular opportunity to use the seat is gone.

### A little Liverpool history

Liverpool's history explains why matchday access means so much to supporters. The club's official [honours list](https://www.liverpoolfc.com/history/honours) records **20 English league titles**, **six European Cups/UEFA Champions Leagues**, **eight FA Cups**, and **10 League Cups**. Under Bill Shankly and Bob Paisley, Liverpool became a major force in English and European football; later milestones included the 2005 Champions League comeback in Istanbul, Jürgen Klopp's 2019 European title and 2019–20 league title, and the 2024–25 league title under Arne Slot.

<p align="center"><a href="https://www.liverpoolfc.com/news/lfcs-champions-walls-updated-celebrate-20th-league-title"><img src="https://backend.liverpoolfc.com/sites/default/files/styles/xl/public/2025-04/1-Champions-Wall-280425_7c1669a60e77713497dc645f2e5aa5ca.JPG?itok=EN1S1xvf" width="780" alt="Liverpool FC Champions Wall at Anfield"></a></p>

*The club's Champions Wall provides football context, not a variable in the analysis. Image linked from Liverpool FC's official website.*

## Explore the interactive project

The [live Anfield experience](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/) presents the study as a connected journey: discover the stadium, examine matches, follow the ticketing process, compare evidence, and test hypothetical recovery scenarios. The website is **how the research is communicated**, not the research question itself.

| | |
| --- | --- |
| [![Arrival view](reports/figures/arrival-desktop.png)](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/) **01 · Arrival** — Locate Anfield and enter the matchday context. | [![Stadium view](reports/figures/stadium-desktop.png)](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/) **02 · Stadium** — Explore the four stands and finite seat capacity. |
| [![Matchday analysis](reports/figures/matchday-desktop.png)](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/) **03 · Matchday** — Inspect fixture-level published unused-ticket counts. | [![Ticket journey](reports/figures/inventory-desktop.png)](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/) **04 · Ticket journey** — Understand forwarding and exchange, including what is not measured. |

The application also includes **match context, policy review, forecasting evidence, a scenario lab, and a decision centre**. These help visitors distinguish observed data from exploratory comparisons and hypothetical outcomes.

## Data and analytical approach

### 1. Bringing together public evidence

I extracted fixture-level non-attendance figures from two Liverpool FC ticketing publications and joined them with public Premier League fixture dates and kickoff information. The resulting analysis covers **38 verified home fixtures**. The 2025–26 report additionally includes fixture-level forwarding data.

The project uses **Python** for data collection, cleaning, validation and analysis, and **SQL** to organize and query the relationships among fixtures, seasons, ticketing records, and contextual information. Data definitions, extraction checks, and original sources are documented in [DATA_PROVENANCE.md](DATA_PROVENANCE.md).

**An essential comparability issue:** the 2024–25 publication describes unused tickets across *all stadium tickets*, while the 2025–26 publication refers to *home tickets*. Without confirmation that these populations match, differences between the two totals cannot be interpreted as a genuine improvement or deterioration.

<p align="center"><img src="reports/figures/utilization.png" width="920" alt="Published unused tickets across Liverpool home fixtures"></p>

### 2. Investigating season patterns and ticketing policy

To reduce changes in the opponent mix, I also compared the **16 opponents appearing in both seasons**. Their average published difference was approximately **−1.6 tickets per fixture**, but a bootstrap interval of about **−386 to +367** was too wide to support a clear conclusion. The underlying reporting definitions also remain different.

Liverpool separately reported a **23% reduction in empty general-admission season-ticket seats** following its *Every Seat, Every Game* initiative. That figure applies to a specific subgroup reported by the club. This study does **not** treat it as independent proof of a club-wide or causal reduction in unused tickets.

### 3. Testing whether forecasting adds value

The forecasting question was straightforward: **Before a match, can historical patterns and available fixture context help anticipate the number of tickets that may go unused?**

Using the **19 consistently defined 2025–26 fixtures**, I compared three approaches over **nine later, held-out matches**. Earlier matches were used to forecast later matches rather than randomly mixing the sequence.

| Forecasting approach | Mean absolute error |
| --- | ---: |
| Expanding historical average | **437 tickets** |
| Ridge regression with match context | **454 tickets** |
| Previous fixture's count | **1,110 tickets** |

The simple historical-average method performed slightly better than the Ridge model. That is a meaningful finding: **a more complicated model is not automatically more useful**, particularly with very limited historical data. These results are an exploratory benchmark, not a deployment-ready forecasting service.

<p align="center"><img src="reports/figures/model-desktop.png" width="920" alt="Forecast evaluation in the Anfield interactive project"></p>

### 4. Exploring potential supporter-access decisions

A forecast alone does not fill a seat. So the project also asks what different *assumed* recovery rates could mean for access.

For Liverpool's 2025–26 home fixture against Fulham, the club published **2,820 unused tickets**. If an illustrative process recovered and successfully used **25%**, that would produce **705 additional supporter opportunities**, leaving **2,115** unused tickets under the scenario assumptions.

This is **scenario arithmetic, not observed attendance, evidence of policy effectiveness, or incremental revenue**. Many allocated tickets were already sold, and the public data does not show how many recoveries would actually succeed.

<p align="center"><img src="reports/figures/scenario-desktop.png" width="920" alt="Hypothetical ticket recovery scenario in the interactive Anfield project"></p>

## What the findings mean for decisions

The work suggests three practical priorities for any future evaluation of ticket utilization:

1. **Measure the full ticket journey.** Link allocation, return or forwarding, acceptance, and turnstile entry before concluding that a redistribution process improved attendance.
2. **Establish a dependable baseline.** Evaluate simple forecasts against more advanced ones using data that would genuinely have been available before kickoff.
3. **Test interventions rather than assume success.** If operational access becomes possible, evaluate reminders, return windows, or exchange processes against observed attendance and supporter access—not hypothetical recovery percentages alone.

The project does not claim that Liverpool should implement a particular policy. It identifies what evidence could help a club make and test that decision.

## Data availability and research limitations

**This is an independent study using public information, without access to Liverpool FC's internal ticketing or operations databases.** Those private systems might contain details unavailable to outside researchers, such as ticket-holder status, acceptance of forwarding or exchange, time of return, and scan records at stadium entry. The study neither accesses nor reconstructs those individual records.

This creates three distinct limitations:

- **Access:** public reports cannot provide the full operational picture available to the club.
- **Measurement:** published counts do not track every ticket from allocation to entry; ticket forwarding should not be equated with attendance.
- **Forecasting:** the number of consistently defined fixture-level observations is small, limiting confidence in long-range predictions or complex models.

Accordingly, the study **does not estimate confirmed lost revenue, prove the causal effect of ticketing policies, or claim production forecasting performance**. It also does not infer stand-level empty seats from unavailable figures or treat present-day ticket prices as historical revenue.

These aren't merely footnotes. Recognizing what the data **cannot** answer is essential to identifying a useful next research step.

## Future research and development

The existing work is a foundation, not an endpoint. The following directions are **proposals**, not completed features or validated findings.

### 1. Improve forecasting with more relevant data

Investigate whether additional consistent historical ticketing records and carefully timed external variables—such as opponent, kickoff schedule, weather forecasts, holidays, and transport conditions—help estimate non-attendance. Advanced forecasting approaches, including sequence models, should only be tested when the available data genuinely supports them and against strong simple baselines.

### 2. Understand how redistribution changes attendance

With suitable data, study when tickets are returned, whether they reach another supporter, and whether that supporter enters the stadium. This would create a stronger foundation for evaluating return reminders, exchange processes, and ticket-access policies.

### 3. Study the wider matchday economy

Explore whether public or partner-provided data on local hospitality, tourism, transport demand, and other surrounding activity reveal patterns associated with home fixtures. **Matchday economic activity and the incremental impact of recovering unused tickets are different questions**; any attempt to measure causal effects would need additional evidence and a suitable study design.

### 4. Connect forecasting to practical decisions

If more detailed operational data becomes available, extend the decision-support framework to compare predicted non-attendance, possible redistribution strategies, implementation constraints, and uncertainty. The objective would be better-informed decisions, not complexity for its own sake.

## Reproduce and verify the analysis

The repository includes six executed narrative notebooks, extracted source manifests, validation checks, model-evaluation outputs, SQL schema and queries, and automated tests.

See [reproduction instructions](docs/REPRODUCTION.md) for the full Python 3.12 environment and React build steps. For evidence behind public-facing figures, see [verified portfolio claims](VERIFIED_PORTFOLIO_CLAIMS.md). For original publication links, transformations, definitions and caveats, see [data provenance](DATA_PROVENANCE.md).

**Tools:** Python, pandas, SQL (SQLite and PostgreSQL), scikit-learn, Jupyter, React, Vite, Recharts and MapLibre. Validation and interface checks use pytest, Playwright and GitHub Actions.

---

*Independent educational project. Not affiliated with or endorsed by Liverpool FC. Football imagery and the Liverpool crest are linked from official club pages for context; all rights remain with their respective owners. The project does not use those images as analytical data.*
