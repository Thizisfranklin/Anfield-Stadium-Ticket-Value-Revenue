"""Author and execute narrative notebooks; reusable computation remains in modules."""
import json
from pathlib import Path
import nbformat as nbf
from nbclient import NotebookClient
ROOT=Path(__file__).resolve().parents[1]
SETUP="""from pathlib import Path
import sys, json
ROOT = Path.cwd()
if ROOT.name == 'notebooks': ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))
import pandas as pd
from IPython.display import display, Image
d = pd.read_csv(ROOT / 'data/processed/fixtures.csv')
ctx = json.loads((ROOT / 'data/curated/context.json').read_text())
"""
BOOKS=[
('01_data_audit','Data audit: what can the sources actually tell us?',
 '''The business question concerns scarce inventory and supporter access. Begin by auditing measurement, not choosing a model. The 2024–25 source provides 19 league non-attendance rows; 2025–26 adds 19 forwarding rows. Cup means must remain separate. The 2025–26 opponent labels are crests: their order was visually verified on PDF pages 7–8 and recorded in a curated manifest.

**Material caveat:** the older PDF says all tickets in the stadium; the newer says home tickets. Equivalence is unconfirmed. Capacity is not sold inventory. Missing forwarding in 2024–25 is null, not zero.''',
 ["from analysis.ingest import extract\nfrom analysis.validation import validate_fixtures\nraw = extract()\nvalidate_fixtures(raw)\ndisplay(raw.groupby('season').agg(fixtures=('id','count'), forwarding_observations=('forwarded_tickets','count')))\ndisplay(raw.isna().sum().to_frame('missing'))",
  "display(pd.DataFrame(ctx['cup_summary']))\ndisplay(pd.read_csv(ROOT/'data/curated/prices.csv'))"],
 'Contract: no stand-level ticket behavior, no invented attendance, and no cup fixture rows. Current 2026–27 prices are contextual, not historical realized prices.'),
('02_ticket_utilization_eda','Unused inventory and the cost of a missed opportunity',
 'A sold ticket can go unused. That represents a missed supporter opportunity, but not automatically lost ticket revenue. We analyze counts and the physical-capacity context ratio; exact sold-ticket utilization cannot be calculated.',
 ["display(d.groupby('season').unused_tickets.agg(['count','sum','mean','median','min','max']))\ndisplay(d.sort_values('unused_tickets',ascending=False)[['season','opponent','unused_tickets','scope']].head(8))",
  "display(Image(filename=str(ROOT/'reports/figures/utilization.png')))"],
 'The largest league unused-ticket count in 2025–26 is Fulham (2,820). Variation across matches suggests operational questions; the counts alone do not establish why fans could not attend.'),
('03_match_context','Fixture context and access denominators',
 'Dates and provider-listed UK kickoff times are joined one-to-one from Football-Data.co.uk. Match results, odds and retrospective outcome features are excluded from the predictive feature set. Cup aggregates are displayed separately.',
 ["display(d.groupby(['season','weekend']).unused_tickets.agg(['count','mean']))\ndisplay(d.groupby(['season','restricted_ballot']).unused_tickets.agg(['count','mean']))",
  "display(pd.DataFrame(ctx['member_access']))\ndisplay(pd.DataFrame(ctx['cup_summary']))\ndisplay(d[d.season.eq('2025-26')][['unused_tickets','forwarded_tickets','kickoff_hour']].corr())"],
 'Ballot access across a whole season and chance of winning one ballot have different denominators. Realized forwarding is a retrospective diagnostic, not a valid known pre-match predictor. Small groups and confounding prevent causal interpretation.'),
('04_policy_analysis','Every Seat, Every Game: observational evidence',
 'The policy targets GA season-ticket holders. The club reports 23% fewer unused seats in that subgroup, but does not publish the subgroup fixture series needed for independent verification. The all-ticket series is a different population. Treat the raw contrast below as definition-sensitive.',
 ["from analysis.policy import compare\np = compare(d)\ndisplay(pd.Series(p))",
  "paired = d[d.season.eq('2024-25')][['opponent','unused_tickets']].merge(d[d.season.eq('2025-26')][['opponent','unused_tickets']],on='opponent',suffixes=('_before','_after'),validate='one_to_one')\npaired['difference']=paired.unused_tickets_after-paired.unused_tickets_before\ndisplay(paired.sort_values('difference'))"],
 'Sixteen common opponents have a mean contrast of −1.625 tickets; the opponent bootstrap interval crosses zero. This is not a causal interval. Season performance, schedules, overlapping ticketing policies, and source scope remain confounders. Obtain ticket-level gate entry and comparable unexposed groups before claiming an effect.'),
('05_modeling','Does pre-match context improve a simple benchmark?',
 'Use the 19 records from 2025–26 to keep target wording consistent. Freeze three features (weekend, kickoff hour, restricted-ballot eligibility) and ridge alpha=10 before evaluating. Final schedule times may be rescheduled: the benchmark represents near-match planning, not booking-date forecasting.',
 ["from analysis.modeling import evaluate\nmodel, predictions = evaluate(d)\ndisplay(pd.DataFrame(model['scores']))\nprint(model['validation'])\nprint(model['decision'])",
  "display(predictions)\nassert (predictions.train_end < predictions.test_date).all()"],
 'The expanding mean has lower held-out MAE than the ridge model on nine unique test fixtures. This tiny evaluation is not evidence of operational readiness. Gaps of 5–29 days and only one comparable season do not support annual seasonal ARIMA. Stationarity is not established; do not force a low-power test or interpolate fictional observations.'),
('06_scenario_analysis','Scenario lab: supporter opportunities, not revenue claims',
 'Assume a share of unused sold tickets is successfully recovered and used. This is an explicit hypothetical intervention with no estimated behavioral response. No revenue multiplier is applied.',
 ["from analysis.validation import scenario\nfulham = d[(d.season=='2025-26') & (d.opponent=='Fulham')].iloc[0]\ndisplay(pd.DataFrame([scenario(int(fulham.unused_tickets),r) for r in [0,25,50,75,100]]))",
  "s=scenario(2820,25)\nassert s['additional_opportunities']==705\nassert s['remaining_unused']==2115\nprint(s['label'])"],
 'At 25% successful recovery, Fulham yields 705 additional supporter opportunities, not an observed attendance increase. Feasibility requires listing, eligibility, resale, gate-entry and cost data. Already-sold seats do not imply incremental sales revenue.')
]

def main():
    (ROOT/'notebooks').mkdir(exist_ok=True)
    for name,title,intro,codes,conclusion in BOOKS:
        nb=nbf.v4.new_notebook()
        nb.metadata.kernelspec={'display_name':'Python 3','language':'python','name':'python3'}
        nb.cells=[nbf.v4.new_markdown_cell(f'# {title}\n\n{intro}'),nbf.v4.new_code_cell(SETUP)]
        nb.cells += [nbf.v4.new_code_cell(code) for code in codes]
        nb.cells.append(nbf.v4.new_markdown_cell('## Interpretation\n\n'+conclusion+'\n\nSources and grain boundaries: [DATA_PROVENANCE.md](../DATA_PROVENANCE.md), [data contract](../docs/DATA_CONTRACT.md).'))
        NotebookClient(nb,timeout=120,kernel_name='python3',resources={'metadata':{'path':str(ROOT)}}).execute()
        nbf.write(nb,ROOT/f'notebooks/{name}.ipynb')
        print(f'Executed {name}')

if __name__=='__main__': main()
