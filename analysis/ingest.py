"""Extract numeric PDF tables, reconcile visually verified crest order, join context."""
import json
import re
from pathlib import Path
import pandas as pd
import pymupdf
from .validation import join_context, validate_fixtures, percent, CAPACITY

ROOT=Path(__file__).resolve().parents[1]
ALIASES={"Nott'm Forest":"Nottingham Forest","Man United":"Manchester United",
         "Man City":"Manchester City","Newcastle":"Newcastle United",
         "West Ham":"West Ham United","Tottenham":"Tottenham Hotspur"}

def extract():
    raw=ROOT/'data/raw'
    old=pymupdf.open(raw/'ticketing-2024-25.pdf')[4].get_text(sort=True)
    pairs=re.findall(r'^\s*([A-Za-z ]+?)\s+([\d,]+)\s*$',old,re.M)
    pairs=[(name.strip(),int(n.replace(',',''))) for name,n in pairs if name.strip()!='Season Average']
    if len(pairs)!=19: raise ValueError(f'2024 PDF schema changed: {len(pairs)} rows')
    new=pymupdf.open(raw/'ticketing-2025-26.pdf')
    def numbers(page, label):
        text=new[page-1].get_text(sort=True)
        # Actual data row starts after Opponent; ignore explanatory text and headline average.
        row=text.split('Opponent')[-1]
        if label=='forwarded': row=row.split('Forwarded')[-1]
        values=[int(x.replace(',','')) for x in re.findall(r'\b\d[\d,]*\b',row)]
        if len(values)!=19: raise ValueError(f'{label}: expected 19 values, got {values}')
        return values
    order=json.loads((ROOT/'data/curated/opponent_order_2025.json').read_text())['opponents']
    rows=[]
    for season, opponents, unused, forwarded,page,scope in [
        ('2024-25',[p[0] for p in pairs],[p[1] for p in pairs],[None]*19,5,'all_stadium_tickets'),
        ('2025-26',order,numbers(7,'unused'),numbers(8,'forwarded'),7,'home_tickets')]:
        for i,(op,u,f) in enumerate(zip(opponents,unused,forwarded,strict=True)):
            rows.append(dict(id=f'{season}-{i+1:02}',season=season,opponent=op,competition='Premier League',
                             unused_tickets=u,forwarded_tickets=f,grain='fixture',scope=scope,
                             source=f'ticketing-{season}.pdf',source_page=page,
                             forwarding_source_page=8 if f is not None else None,
                             unused_capacity_pct=round(percent(u,CAPACITY),4)))
    context=[]
    for short,season in [('2425','2024-25'),('2526','2025-26')]:
        source=pd.read_csv(raw/f'fixtures-{short}.csv')
        if not {'Date','Time','HomeTeam','AwayTeam'}<=set(source): raise ValueError('Fixture source schema changed')
        d=source.loc[source.HomeTeam.eq('Liverpool'),['Date','Time','AwayTeam']].copy()
        d.columns=['date','kickoff','opponent']
        d['date']=pd.to_datetime(d.date,dayfirst=True).dt.strftime('%Y-%m-%d')
        d['opponent']=d.opponent.replace(ALIASES)
        d['season']=season
        context.append(d)
    result=join_context(pd.DataFrame(rows),pd.concat(context)).sort_values('date').reset_index(drop=True)
    result['weekend']=pd.to_datetime(result.date).dt.dayofweek.ge(5)
    result['weekday']=pd.to_datetime(result.date).dt.day_name()
    result['kickoff_hour']=result.kickoff.str.split(':').map(lambda x:int(x[0])+int(x[1])/60)
    # An explicit ballot eligibility context, not a subjective importance score.
    restricted={'Arsenal','Chelsea','Everton','Manchester City','Manchester United','Tottenham Hotspur'}
    result['restricted_ballot']=result.opponent.isin(restricted)
    for _,g in result.groupby('season'):
        result.loc[g.date.idxmax(),'restricted_ballot']=True
    validate_fixtures(result)
    if round(result.loc[result.season.eq('2024-25'),'unused_tickets'].mean())!=1466: raise ValueError('Old mean mismatch')
    if round(result.loc[result.season.eq('2025-26'),'unused_tickets'].mean())!=1517: raise ValueError('New mean mismatch')
    if round(result.forwarded_tickets.mean())!=9926: raise ValueError('Forwarding mean mismatch')
    return result
