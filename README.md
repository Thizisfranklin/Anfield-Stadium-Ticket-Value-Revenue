# Anfield Ticket Value & Revenue Intelligence

> A revenue analytics project examining how seat location, opponent quality, match context, and time-to-kickoff influence secondary-market ticket prices at Liverpool FC's Anfield stadium.

## Context

**Liverpool FC** is a professional soccer club based in Liverpool, England. The club competes in the **Premier League**, the highest level of men's professional soccer in England.

Liverpool plays its home matches at **Anfield**, a stadium divided into four major stands: the Kop, Main Stand, Sir Kenny Dalglish Stand, and Anfield Road Stand.

For someone unfamiliar with soccer, the basic business setup is similar to ticket pricing in U.S. professional sports: the same seat can have very different market value depending on **where it is located, who the opponent is, how important the match is, and how much demand exists before kickoff**.

This project investigates those differences and asks whether secondary-market pricing can reveal useful revenue opportunities.
This project was also inspired by my own interest in Liverpool FC. As a supporter, I understood the club mostly from the football side; working on this project gives me an opportunity to understand a different side of the organization—how ticket demand, stadium structure, pricing, and supporter experience interact as business decisions.


---

## 1. Business Problem

Football clubs cannot assume every seat or every match has the same demand.

A ticket in the same section may attract very different resale prices for:

* Liverpool vs. Manchester United
* Liverpool vs. Everton
* Liverpool vs. a lower-demand opponent

Ticket value may also depend on:

* stadium section
* seating tier
* opponent strength
* rivalry status
* point in the season
* time remaining before kickoff
* available ticket inventory

The project asks:

> **What drives ticket value at Anfield, and which seating sections consistently show stronger or weaker market demand than expected?**

The goal is not simply to recommend higher ticket prices.

A useful pricing strategy must consider both:

**revenue opportunity** and **supporter accessibility**.

---

## 2. Core Questions

### A. What drives ticket value?

Estimate how ticket prices vary with:

* stand
* section
* tier
* row, when available
* opponent
* opponent strength
* rivalry status
* days to kickoff
* ticket availability

### B. Can we estimate expected market value?

Build a model that estimates the expected resale price of a ticket given its seat and match characteristics.

### C. Which sections show unusual pricing gaps?

Compare observed resale prices with model-estimated market value.

Where face value is available:



This helps identify sections with unusually strong secondary-market demand.

---

## 3. Scope

### Club

**Liverpool FC**

### Stadium

**Anfield**

### Competition

**Premier League only**

### Time Period

**One completed Premier League season**

Preferred starting point:

**2025–26**

### Unit of Analysis

**Ticket listing × match**

Results will ultimately be summarized at the **section level**.

### Out of Scope

Version 1 will not:

* analyze every Premier League stadium
* include Champions League or domestic cup matches
* predict individual fan willingness-to-pay
* build real-time dynamic pricing
* recreate Anfield in 3D
* use reinforcement learning
* forecast Liverpool's future results
* model individual customer behavior

---

## 4. Data Sources

### 4.1 StubHub Marketplace Data — Primary Ticket Source

The primary candidate is the **Rebrowser StubHub ticket-marketplace dataset**.

Useful fields include:

* event
* listing ID
* section
* row
* ticket class
* quantity
* resale price
* face value
* listing creation time
* first/last observed time
* listing notes

This source supports the most important part of the project:

**section-level resale pricing.**

Before starting the full analysis, the first task is to confirm that enough historical Liverpool/Anfield listings are available.

If Anfield coverage is insufficient, the project should move to another Premier League stadium with better data rather than expanding the scope.

---

### 4.2 Liverpool FC Official Sources

Official Liverpool information can support:

* Anfield seating layout
* stand names
* official ticket prices
* ticket categories
* ticketing policy
* supporter-access considerations

These sources provide the **primary-market context** needed to interpret resale pricing.

---

### 4.3 Football-Data.co.uk — Match Context

Historical Premier League CSV data can provide:

* match date
* opponent
* final score
* match statistics
* season
* match week

From this data, additional features can be engineered:

```text
opponent_strength
recent_form
league_position_before_match
goal_difference_before_match
rivalry_flag
match_week
```

Only information available **before the match** should be used when constructing predictive features.

---

### 4.4 Weather — Optional

Historical weather can be added using **Open-Meteo** if it proves useful.

Possible features:

* temperature
* rain
* wind

Weather is optional.

If it adds little value, remove it.

---

## 5. Data Model

### `matches`

```text
match_id
match_date
opponent
match_week
opponent_strength
recent_form
rivalry_flag
```

### `ticket_listings`

```text
listing_id
match_id
section
row
ticket_class
quantity
resale_price
face_value
first_seen
last_seen
```

### `sections`

```text
section
stand
tier
side_or_end
section_category
```

---

## 6. SQL Analysis

SQL will be used for actual analytical questions rather than appearing only in the technology stack.

Planned queries:

```text
sql/
├── 01_create_tables.sql
├── 02_data_quality_checks.sql
├── 03_section_pricing.sql
├── 04_opponent_pricing.sql
├── 05_resale_premiums.sql
├── 06_time_to_kickoff.sql
└── 07_modeling_dataset.sql
```

Questions include:

* Which sections have the highest median resale prices?
* Which opponents generate the largest premiums?
* How does the same section change in value across matches?
* How do prices change as kickoff approaches?
* Which sections consistently trade above face value?

---

## 7. Feature Engineering

### Seat Features

```text
stand
section
tier
row
side_or_end
ticket_class
```

### Match Features

```text
opponent
opponent_strength
recent_form
rivalry_flag
match_week
```

### Marketplace Features

```text
days_to_kickoff
listing_quantity
available_inventory
face_value
resale_premium
```

---

## 8. Modeling Strategy

Keep the model stack small.

### Baseline

**Section median price**

A machine-learning model should beat a simple historical benchmark before additional complexity is justified.

### Model 1

**Regression**

Used for interpretability.

Questions:

* How much does section matter?
* How much does opponent quality matter?
* Does time-to-kickoff matter?

### Model 2

**XGBoost**

Used to capture nonlinear relationships and interactions.

That is enough.

No model zoo.

---

## 9. Evaluation

Evaluate with:

* MAE
* RMSE
* \(R^2\)

Where possible, hold out entire matches rather than randomly splitting listings from the same match across train and test sets.

This creates a more realistic test:

> Can the model generalize to a match it has not already seen?

---

## 10. Explainability

Use **SHAP** to understand why predicted prices differ.

Example:

```text
Predicted resale value: £125

Manchester United opponent   +£28
Main Stand                    +£19
Lower tier                    +£13
3 days before kickoff          +£7
High ticket inventory         -£11
```

The objective is not only:

> What will this ticket cost?

but:

> **Why is the market valuing this ticket differently?**

---

## 11. Interactive Anfield Map

Build a simplified section-level stadium visualization.

Filters:

* opponent
* match
* stand
* tier
* days to kickoff

Possible displayed metrics:

* median resale price
* predicted market value
* resale premium
* value gap

The map does not need to recreate every physical seat.

**Section-level visualization is enough.**

---

## 12. Executive Recommendation

> Added after analysis.

The final recommendation should answer:

1. Which sections command the strongest resale premiums?
2. Which opponents create the largest demand effects?
3. How does time-to-kickoff affect price?
4. Which sections appear consistently above or below expected market value?
5. Where might alternative pricing strategies deserve testing?
6. Could higher prices create supporter-accessibility concerns?

---

## 13. Limitations

Important limitations include:

* resale listings are asking prices, not necessarily completed transactions
* not every listing contains face value
* resale customers may not represent all Liverpool supporters
* section categories simplify differences between individual seats
* high resale prices do not automatically mean Liverpool should raise primary ticket prices
* rivalry classification contains some domain judgment

The project will distinguish between:

> **evidence of strong secondary-market demand**

and

> **evidence that the club should change primary pricing**

Those are different claims.

---

## 14. What I Would Test in Production

If a real club wanted to act on the findings, pricing changes should be tested carefully.

Potential metrics:

* ticket conversion
* sell-through rate
* revenue per seat
* unused seats
* ticket-exchange activity
* supporter complaints
* repeat attendance

The goal would be to improve revenue decisions **without unnecessarily reducing accessibility or damaging supporter experience**.

---

## 15. Technology Stack

**Data & Analysis:** Python, SQL, PostgreSQL, pandas, NumPy
**Statistics:** statsmodels
**Machine Learning:** scikit-learn, XGBoost
**Explainability:** SHAP
**Visualization:** Plotly, Matplotlib
**Dashboard:** Streamlit or Plotly Dash
**Development:** Git, GitHub, Jupyter, VS Code

---

## 16. Repository Structure

```text
anfield-ticket-value-intelligence/
│
├── README.md
├── data/
│   ├── README.md
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_data_validation.ipynb
│   ├── 02_ticket_eda.ipynb
│   ├── 03_section_analysis.ipynb
│   ├── 04_pricing_models.ipynb
│   └── 05_model_interpretation.ipynb
├── sql/
├── src/
├── dashboard/
├── reports/
├── requirements.txt
└── .gitignore
```

---

## 17. Results

> To be completed after analysis.

No hypothetical accuracy, pricing, or revenue figures will be presented as real results.
