"""Fail closed at grain, denominator, schema and join boundaries."""
import math
import pandas as pd

CAPACITY = 61276
SEASONS = {'2024-25', '2025-26'}

def percent(numerator, denominator):
    if not math.isfinite(denominator) or denominator <= 0:
        raise ValueError('A finite positive denominator is required')
    if not math.isfinite(numerator) or numerator < 0 or numerator > denominator:
        raise ValueError('Invalid numerator')
    return numerator / denominator * 100

def scenario(unused, recovery_percent):
    if not math.isfinite(unused) or unused < 0 or unused > CAPACITY:
        raise ValueError('Invalid unused-ticket count')
    if not math.isfinite(recovery_percent) or not 0 <= recovery_percent <= 100:
        raise ValueError('Recovery must lie between 0 and 100')
    recovered = unused * recovery_percent / 100
    return {'recovery_percent':recovery_percent,'additional_opportunities':round(recovered,2),
            'remaining_unused':round(unused-recovered,2),
            'capacity_percentage_points':round(percent(recovered,CAPACITY),4),
            'label':'SCENARIO — NOT OBSERVED DATA'}

def require_grain(frame, grain):
    if 'grain' not in frame or not frame['grain'].eq(grain).all():
        raise ValueError(f'Expected {grain} grain; disaggregation is prohibited')

def join_context(metrics, context):
    require_grain(metrics, 'fixture')
    keys=['season','opponent']
    out=metrics.merge(context,on=keys,how='left',validate='one_to_one',indicator=True)
    if not out['_merge'].eq('both').all(): raise ValueError('Unmatched fixture')
    return out.drop(columns='_merge')

def validate_fixtures(d):
    require_grain(d,'fixture')
    if set(d.season) != SEASONS: raise ValueError('Unexpected seasons')
    if d.duplicated(['season','opponent','competition']).any(): raise ValueError('Duplicate fixtures')
    if d.duplicated('id').any(): raise ValueError('Duplicate identifiers')
    if d[['id','date','kickoff','opponent','unused_tickets','scope']].isna().any().any():
        raise ValueError('Missing required values')
    for season, group in d.groupby('season'):
        if len(group)!=19: raise ValueError('Expected 19 PL home fixtures')
        dates=pd.to_datetime(group.date)
        year=int(season[:4])
        if not ((dates>=f'{year}-08-01') & (dates<=f'{year+1}-06-30')).all():
            raise ValueError('Incorrect season mapping')
    for col in ['unused_tickets','forwarded_tickets']:
        v=d[col].dropna()
        if not (v.between(0,CAPACITY)&v.eq(v.astype(int))).all(): raise ValueError('Invalid ticket units')
    if d.loc[d.season.eq('2024-25'),'forwarded_tickets'].notna().any():
        raise ValueError('2024-25 forwarding not published at fixture grain')
    if d.loc[d.season.eq('2025-26'),'forwarded_tickets'].isna().any():
        raise ValueError('2025-26 forwarding unexpectedly missing')
    if 'stand' in d.columns: raise ValueError('Fixture metrics cannot be stand measurements')
