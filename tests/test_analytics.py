import json
import sqlite3
from pathlib import Path
import numpy as np
import pandas as pd
import pytest
from jsonschema import Draft202012Validator,FormatChecker
from analysis.ingest import extract
from analysis.validation import validate_fixtures,require_grain,join_context,scenario,percent,CAPACITY
from analysis.modeling import evaluate,FEATURES
from analysis.policy import compare
from analysis.database import populate
ROOT=Path(__file__).resolve().parents[1]

@pytest.fixture(scope='module')
def d(): return pd.read_csv(ROOT/'data/processed/fixtures.csv')

def test_raw_pdf_reconciles_processed(d):
    actual=extract()
    pd.testing.assert_frame_equal(actual,d,check_dtype=False)

def test_fixture_schema(d): validate_fixtures(d)

@pytest.mark.parametrize('mutation',['duplicate','missing','season','units','stand','fake_forwarding'])
def test_invalid_records_rejected(d,mutation):
    x=d.copy()
    if mutation=='duplicate': x=pd.concat([x,x.iloc[:1]])
    if mutation=='missing': x.loc[0,'date']=None
    if mutation=='season': x.loc[0,'date']='2030-01-01'
    if mutation=='units': x['unused_tickets']=x.unused_tickets.astype(float);x.loc[0,'unused_tickets']=1.5
    if mutation=='stand': x['stand']='The Kop'
    if mutation=='fake_forwarding': x.loc[0,'forwarded_tickets']=0
    with pytest.raises(ValueError): validate_fixtures(x)

def test_grain_blocks_disaggregation(d):
    with pytest.raises(ValueError): require_grain(d,'stand')

def test_join_fails_missing_or_duplicate(d):
    metrics=d.drop(columns=['date','kickoff']);ctx=d[['season','opponent','date','kickoff']]
    with pytest.raises(ValueError):join_context(metrics,ctx.iloc[1:])
    with pytest.raises(pd.errors.MergeError):join_context(metrics,pd.concat([ctx,ctx.iloc[:1]]))

@pytest.mark.parametrize('a,b',[(1,0),(-1,100),(101,100),(float('nan'),100)])
def test_bad_percent(a,b):
    with pytest.raises(ValueError):percent(a,b)

def test_percent(): assert percent(25,100)==25

@pytest.mark.parametrize('recovery',[0,5,25,50,100])
def test_scenarios_conserve_tickets(recovery):
    s=scenario(2820,recovery)
    assert s['additional_opportunities']+s['remaining_unused']==2820
    assert s['additional_opportunities']==2820*recovery/100
    assert s['capacity_percentage_points']==round(2820*recovery/CAPACITY,4)
    assert s['label']=='SCENARIO — NOT OBSERVED DATA'

@pytest.mark.parametrize('unused,recovery',[(-1,25),(20,-1),(20,101),(20,float('nan'))])
def test_invalid_scenarios(unused,recovery):
    with pytest.raises(ValueError):scenario(unused,recovery)

def test_model_split_and_training_only_baseline(d):
    result,p=evaluate(d)
    assert (p.train_end<p.test_date).all()
    assert p[p.model.eq('expanding_mean')].fixture_id.nunique()==9
    assert set(FEATURES)=={'weekend','kickoff_hour','restricted_ballot'}
    x=d[d.season.eq('2025-26')].sort_values('date')
    assert np.allclose(p[(p.model=='expanding_mean')&(p.fold==10)].prediction,x.iloc[:10].unused_tickets.mean(),atol=.0001)
    mutated=d.copy();last=mutated.date.eq(mutated.date.max());mutated.loc[last,'unused_tickets']=60000
    _,p2=evaluate(mutated)
    assert p.prediction.equals(p2.prediction) # final held-out label cannot affect any prediction

def test_policy_pairing(d):
    p=compare(d)
    assert p['comparable_opponents']==16
    assert p['paired_mean_change']==-1.625
    assert p['ga_st_reported_change_pct']==-23
    assert p['paired_bootstrap_95'][0]<0<p['paired_bootstrap_95'][1]

def test_export_schema_and_scenarios(d):
    data=json.loads((ROOT/'app/public/data/intelligence.json').read_text(encoding='utf-8'))
    schema=json.loads((ROOT/'validation/frontend.schema.json').read_text(encoding='utf-8'))
    Draft202012Validator(schema,format_checker=FormatChecker()).validate(data)
    for f in data['fixtures']:
        assert len({s['recovery_percent'] for s in f['scenarios']})==21
        assert f['scenarios']==[scenario(f['unused_tickets'],r) for r in range(0,101,5)]
    assert len({f['id'] for f in data['fixtures']})==38
    data['stands'][0]['unused_tickets']=100
    with pytest.raises(Exception):Draft202012Validator(schema).validate(data)

def test_sql_matches_python(d):
    ctx=json.loads((ROOT/'data/curated/context.json').read_text())
    prices=pd.read_csv(ROOT/'data/curated/prices.csv')
    with sqlite3.connect(':memory:') as c:
        c.execute('PRAGMA foreign_keys=ON');results=populate(c,d,ctx,prices)
        assert len(results)==4
        assert len(results[2])==16
        for row in results[0]:assert row['mean_unused']==pytest.approx(d[d.season.eq(row['season'])].unused_tickets.mean())
        with pytest.raises(sqlite3.IntegrityError):c.execute("INSERT INTO ticketing_metrics VALUES ('fake',1,1,'home_tickets','x',1,'fixture')")
