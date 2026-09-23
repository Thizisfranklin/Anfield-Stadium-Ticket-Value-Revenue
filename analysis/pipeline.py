import json
import os
from pathlib import Path
os.environ.setdefault('MPLCONFIGDIR',str(Path(__file__).resolve().parents[1]/'work/matplotlib'))
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from .ingest import extract
from .modeling import evaluate
from .policy import compare
from .validation import scenario

ROOT=Path(__file__).resolve().parents[1]
def dump(path,value):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(value,indent=2,allow_nan=False),encoding='utf-8')

def main():
    for folder in ['data/processed','reports/figures','app/public/data']:
        (ROOT/folder).mkdir(parents=True,exist_ok=True)
    d=extract()
    d.to_csv(ROOT/'data/processed/fixtures.csv',index=False)
    ctx=json.loads((ROOT/'data/curated/context.json').read_text())
    prices=pd.read_csv(ROOT/'data/curated/prices.csv')
    summary=[]
    for (season,competition),g in d.groupby(['season','competition']):
        summary.append(dict(season=season,competition=competition,n=len(g),
            unused_mean=round(float(g.unused_tickets.mean()),2),unused_total=int(g.unused_tickets.sum()),
            forwarded_mean=None if g.forwarded_tickets.isna().all() else round(float(g.forwarded_tickets.mean()),2),
            scope=g.scope.iloc[0],grain='season_competition'))
    policy=compare(d)
    model,pred=evaluate(d)
    pred.to_csv(ROOT/'reports/model_predictions.csv',index=False)
    dump(ROOT/'reports/model_results.json',model)
    dump(ROOT/'reports/policy_results.json',policy)
    records=json.loads(d.to_json(orient='records'))
    for record in records:
        record['scenarios']=[scenario(record['unused_tickets'],x) for x in range(0,101,5)]
    weekdays=[]
    for (season,weekend),g in d.groupby(['season','weekend']):
        weekdays.append(dict(season=season,group='Weekend' if weekend else 'Weekday',n=len(g),unused_mean=round(float(g.unused_tickets.mean()),2)))
    artifact=dict(schema_version='1.0',as_of='2026-09-23',**ctx,fixtures=records,season_summary=summary,
                  prices=json.loads(prices.to_json(orient='records')),policy=policy,model=model,weekday_summary=weekdays,
                  source_links={'2024-25':'https://drive.google.com/file/d/1eS8BnI8QpBdjSiwhaVb3Vh-vuqTFlVef/view',
                                '2025-26':'https://drive.google.com/file/d/10GcbSS106KbP7nbyPy-T0ONkCeqfsGMU/view',
                                'prices':'https://www.liverpoolfc.com/tickets/lfc-ticket-prices',
                                'access':'https://backend.liverpoolfc.com/sites/default/files/2026-03/Access_Statement_-_LATEST__March_5a6934336def9e01eeef96e550620350.pdf'})
    dump(ROOT/'app/public/data/intelligence.json',artifact)
    dump(ROOT/'data/processed/summary.json',{k:v for k,v in artifact.items() if k!='fixtures'})
    plt.style.use('dark_background')
    fig,axes=plt.subplots(1,2,figsize=(14,5),layout='constrained')
    for season,g in d.groupby('season'):
        axes[0].plot(pd.to_datetime(g.date),g.unused_tickets,'o-',label=season,lw=1)
    axes[0].set(title='Published unused tickets by fixture',ylabel='Tickets (source populations differ)')
    axes[0].legend(); axes[0].tick_params(axis='x',rotation=35)
    comp=[('Premier League',summary[1]['unused_mean'])]+[(r['competition'],r['unused_mean']) for r in ctx['cup_summary']]
    axes[1].barh([x[0] for x in comp],[x[1] for x in comp],color=['#54d5bf','#e8c785','#e8c785','#e8c785'])
    axes[1].set(title='2025–26 competition means',xlabel='Published unused tickets per game')
    fig.suptitle('ANFIELD MATCHDAY INTELLIGENCE | Descriptive evidence, not causal effects')
    fig.savefig(ROOT/'reports/figures/utilization.png',dpi=160); plt.close(fig)
    print(json.dumps({'fixtures':len(d),'summary':summary,'policy':policy,'model':model},indent=2))
    from .database import main as sql
    sql()

if __name__=='__main__': main()
