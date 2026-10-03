# Anfield Matchday Intelligence

<p align="center"><img src="https://backend.liverpoolfc.com/sites/default/files/styles/lg/public/2024-06/lfc-digital-crest-story-23062024.webp?itok=g5u5mxnB&amp;width=1680" width="125" alt="Liverpool FC Liver Bird"></p>

<p align="center"><strong>Ticket utilization · Supporter access · Matchday analytics</strong></p>

<p align="center"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><strong>Explore the live interactive project ↗</strong></a></p>

**A sold-out stadium. An unused ticket. Someone still trying to get in.** That's the question behind this project: how can a football club make better use of its limited ticket inventory so more supporters have a chance to attend?

I built this as an independent Liverpool FC case study using public club reports, Python, SQL, statistical analysis and an interactive React website. It is not affiliated with Liverpool FC.

## New to football (soccer)? Here's the context

Liverpool FC plays in the **Premier League**, England's top football division. Its home, **Anfield**, has a published physical capacity of **61,276 seats**. For many matches, demand is high, but a ticket that was already allocated or sold can still go unused. Supporters who cannot attend may be able to **forward** a ticket to another person or use the club's **Ticket Exchange**. Neither action necessarily tells us whether someone ultimately enters the stadium.

Think of it as an inventory and access problem: unlike online products or airline seats, a matchday seat expires when the match ends. There is no later opportunity to use that exact seat for that exact game.

### A little Liverpool history

Liverpool's story helps explain why so many people care about getting into Anfield. The club's official **Champions Wall** records its major men's trophies, including **20 English league titles**, **6 European Cups/UEFA Champions Leagues**, **8 FA Cups**, and **10 League Cups**. The league title decides England's champion; the European Cup/Champions League decides Europe's top club competition; the FA Cup and League Cup are separate English knockout competitions. <a href="https://www.liverpoolfc.com/history/honours">Full official honours list ↗</a>

<p align="center">
<a href="https://www.liverpoolfc.com/news/lfcs-champions-walls-updated-celebrate-20th-league-title">
<img src="https://backend.liverpoolfc.com/sites/default/files/styles/xl/public/2025-04/1-Champions-Wall-280425_7c1669a60e77713497dc645f2e5aa5ca.JPG?itok=EN1S1xvf" width="780" alt="Official Liverpool FC photograph of the Champions Wall at Anfield, showing European Cups and other historic honours">
</a>
<br><em>Liverpool FC's Champions Wall, updated after the 2024–25 league title. Photo and further images: <a href="https://www.liverpoolfc.com/news/lfcs-champions-walls-updated-celebrate-20th-league-title">Liverpool FC</a>.</em>
</p>

Under **Bill Shankly**, Liverpool rebuilt into an English powerhouse in the 1960s and 1970s. **Bob Paisley's** era delivered sustained domestic and European success. The club's **2005 European Cup comeback in Istanbul** became a defining modern moment; **Jürgen Klopp's** team won Europe in 2019 and the league in 2019–20, before Liverpool captured a **20th league title in 2024–25** under Arne Slot. The history is context, not a variable in the analysis.

### The players behind the atmosphere

These official player portraits help give readers unfamiliar with Liverpool a sense of the people and culture around the club. They are football context only; **player performance isn't part of the dataset**.

<table>
<tr>
<td align="center" width="25%">
<a href="https://www.liverpoolfc.com/teams/mens-team/florian-wirtz">
<img src="https://contentfulproxy.stadion.io/rm6ms1yxue4m/6085H6wrCRnwjZxgLOWJ04/defc00147d03203321adca8cc53348c2/florian-wirtz-hero-image.jpg?f=face&amp;fit=fill&amp;fm=webp&amp;h=1016&amp;w=2000" width="210" alt="Florian Wirtz">
</a><br><b>Florian Wirtz</b>
</td>
<td align="center" width="25%">
<a href="https://www.liverpoolfc.com/teams/mens-team/alexander-isak">
<img src="https://contentfulproxy.stadion.io/rm6ms1yxue4m/6n56DZ2jV4O05PR2SpT88s/6be433dcda7804254245edf26af9adb3/alexander-isak-hero-image.jpg?f=face&amp;fit=fill&amp;fm=webp&amp;h=1016&amp;w=2000" width="210" alt="Alexander Isak">
</a><br><b>Alexander Isak</b>
</td>
<td align="center" width="25%">
<a href="https://www.liverpoolfc.com/teams/mens-team/hugo-ekitike">
<img src="https://contentfulproxy.stadion.io/rm6ms1yxue4m/4iMPlLST60EvV0ksl7jVDF/0a2972cb4bd9ade80d66908d06136a92/hugo-ekitike-hero-image.jpg?f=face&amp;fit=fill&amp;fm=webp&amp;h=1016&amp;w=2000" width="210" alt="Hugo Ekitike">
</a><br><b>Hugo Ekitike</b>
</td>
<td align="center" width="25%">
<a href="https://www.liverpoolfc.com/teams/mens-team/bradley-barcola">
<img src="https://contentfulproxy.stadion.io/rm6ms1yxue4m/70u7khhf7va1ZuXEN1KbGR/32c88ff82e113f7bbc32dcf74b8547bf/bradley-barcola-hero-image.jpg?f=face&amp;fit=fill&amp;fm=webp&amp;h=1015&amp;w=2000" width="210" alt="Bradley Barcola">
</a><br><b>Bradley Barcola</b>
</td>
</tr>
</table>

Liverpool's recent history is also strongly associated with players such as **Mohamed Salah**, who left the club after the 2025–26 season following nine years at Anfield.

<p align="center">
<a href="https://www.liverpoolfc.com/news/mohamed-salah-i-am-blessed-i-will-always-love-liverpool-fc">
<img src="https://backend.liverpoolfc.com/sites/default/files/styles/lg/public/2026-05/mohamed-salah-original-quotes-18052026_6986aacdeec33ff335c8824a5b11bc6a.webp?itok=GK1DInV3&amp;width=1680" width="520" alt="Mohamed Salah">
</a>
</p>

<p align="center"><em>Context only: official Liverpool FC-hosted imagery. No player-performance variables enter the project.</em></p>

## Why I made this

I've supported Liverpool since I was around five. Getting access to tickets is something I connect with personally, so I wanted to investigate what happens *around* the match rather than predict match results.

**My main question:** when ticket demand is constrained, what can public data tell us about unused seats, ticket forwarding and opportunities for more supporters to attend?

## Explore the website

This project isn't just a collection of notebooks. I built a connected **React application** to tell the story, from the stadium itself to fixture results, policy questions, prediction and possible next steps.

<table>
<tr>
<td width="50%"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><img src="reports/figures/arrival-desktop.png" width="100%" alt="Interactive map arrival screen locating Anfield in Liverpool"></a><br><b>01 · Arrival</b><br>Meet the place before the numbers.</td>
<td width="50%"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><img src="reports/figures/stadium-desktop.png" width="100%" alt="Interactive four-stand illustration of Anfield"></a><br><b>02 · Stadium</b><br>Explore four stands and understand the limited physical inventory.</td>
</tr>
<tr>
<td width="50%"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><img src="reports/figures/matchday-desktop.png" width="100%" alt="Matchday view showing unused tickets across home fixtures"></a><br><b>03 · Matchday</b><br>Choose a season and fixture to inspect unused ticket counts.</td>
<td width="50%"><a href="https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/"><img src="reports/figures/inventory-desktop.png" width="100%" alt="Ticket forwarding and exchange journey"></a><br><b>04 · Ticket journey</b><br>See where forwarding and the Ticket Exchange fit in—and what isn't measured.</td>
</tr>
</table>

**[Open all eight interactive sections ↗](https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/)** — including match context, policy review, the scenario lab, model evidence and a decision centre.

## The data and what I found

I brought together two seasons of official Liverpool ticketing reports, plus public fixture dates and kickoff times. The validated core dataset has **38 Premier League home fixtures** (19 per season). The 2025–26 report also provides fixture-level ticket forwarding counts.

| Question | What the data showed |
| --- | --- |
| How many published tickets went unused? | **27,845** across 2024–25 league home fixtures and **28,821** across 2025–26; around **1,500 per match** in each season |
| How much ticket forwarding happened? | A published average of **9,926 forwarded tickets per 2025–26 home league match** |
| Did utilization improve between seasons? | No reliable like-for-like conclusion: the reports describe different ticket populations |
| Could a model predict unused tickets? | A simple historical-average benchmark made smaller errors than the Ridge model in this small test |

**A crucial distinction:** the older report refers to *all stadium tickets* while the newer one refers to *home tickets*. I haven't treated the difference between their totals as evidence that Liverpool improved or worsened.

<p align="center"><img src="reports/figures/utilization.png" width="920" alt="Published unused tickets by home fixture and competition-level means"></p>

### 1. Comparing similar opponents

I also compared the **16 opponents** that appeared in both seasons to reduce the influence of fixture mix. Their average published unused-ticket difference was **−1.6 tickets**; a bootstrap interval ran from **−386 to +367**. It's too broad to identify a clear change, and differing source definitions remain a limitation. Liverpool separately reported a **23% reduction in empty general-admission season-ticket seats** after its Every Seat, Every Game initiative—but that is a different subgroup, not proof of an overall or causal decline.

### 2. Testing whether machine learning helps

Using the **19 consistently defined 2025–26 fixtures**, I tested three approaches on **nine later, held-out fixtures**. All features were available before a match; later fixtures weren't used to train predictions for earlier fixtures.

| Forecasting approach | Average error (MAE) |
| --- | ---: |
| Expanding historical average | **437 tickets** |
| Ridge regression using match context | **454 tickets** |
| Last fixture's count | **1,110 tickets** |

The simplest approach did slightly better than Ridge in this evaluation. With such a small dataset, I wouldn't claim that a complex model is ready to forecast future matches.

<p align="center"><img src="reports/figures/model-desktop.png" width="920" alt="Interactive model-evidence view comparing a historical average, Ridge regression and last-match benchmark"></p>

### 3. What could unused seats mean for supporters?

Rather than call every unused ticket “lost revenue”—many were already sold—I built an interactive **what-if scenario**. Fulham's 2025–26 fixture had **2,820 published unused tickets**. If a hypothetical process successfully recovered and used 25% of those tickets, that would mean **705 additional supporter opportunities**. This is an illustration, **not an observed result or a forecast**.

<p align="center"><img src="reports/figures/scenario-desktop.png" width="920" alt="Interactive policy lab showing hypothetical ticket recovery scenarios"></p>

## Where this could go next

The biggest gap isn't another model: it's what public reports can't show. To understand whether redistribution really works, the club would need to follow a ticket from **allocation → forwarding or exchange → new holder → stadium entry**. With that information, controlled tests of reminders or return policies could measure actual gains in supporter access.

The analysis deliberately **does not** invent stand-level unused seats, use today's prices as historical revenue, or treat policy changes as proven causes. For the full methods, sources and checks, see [data provenance](DATA_PROVENANCE.md), [reproduction steps](docs/REPRODUCTION.md) and [verified project claims](VERIFIED_PORTFOLIO_CLAIMS.md).

**Built with:** Python, pandas, SQL (SQLite and PostgreSQL), scikit-learn, Jupyter, React, Vite, Recharts and MapLibre. Tested using pytest, Playwright and GitHub Actions.

*Independent educational project. Liverpool FC photography and emblem are linked from official club pages for football context; those images are not used in the analysis. All rights remain with their respective owners. Not affiliated with or endorsed by Liverpool FC.*
