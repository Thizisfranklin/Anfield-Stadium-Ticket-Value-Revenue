"""Same schema/queries executed on SQLite and PostgreSQL; no browser DB dependency."""
import json
import os
import sqlite3
from pathlib import Path
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]

def populate(conn, d, context, prices, postgres=False):
    schema=(ROOT/'sql/schema.sql').read_text()
    if postgres:
        # Dedicated schema, no modification of public or other user data.
        conn.execute('CREATE SCHEMA IF NOT EXISTS anfield_intelligence')
        conn.execute('SET search_path TO anfield_intelligence')
    for statement in schema.split(';'):
        if statement.strip(): conn.execute(statement)
    marker='%s' if postgres else '?'
    def insert(table,rows):
        if rows:
            query=f'INSERT INTO {table} VALUES ({",".join([marker]*len(rows[0]))})'
            for row in rows: conn.execute(query,row)
    insert('seasons',[(x,) for x in sorted(d.season.unique())])
    insert('competitions',[(x,) for x in ['Premier League','FA Cup','Carabao Cup','Champions League']])
    insert('fixtures',[(r.id,r.season,r.competition,r.opponent,r.date,r.kickoff) for r in d.itertuples()])
    insert('ticketing_metrics',[(r.id,int(r.unused_tickets),None if pd.isna(r.forwarded_tickets) else int(r.forwarded_tickets),r.scope,r.source,r.source_page,'fixture') for r in d.itertuples()])
    insert('stands',[(s['id'],s['name'],s['tiers']) for s in context['stands']])
    insert('ticket_prices',[(r.season,r.band,r.adult_gbp,r.over65_gbp,r.young_adult_gbp,r.junior_gbp) for r in prices.itertuples()])
    stand_ids={s['name']:s['id'] for s in context['stands']}
    insert('price_stands',[(r.season,r.band,stand_ids[s]) for r in prices.itertuples() for s in r.stands.split('|')])
    insert('competition_summaries',[(r['season'],r['competition'],r['unused_mean'],r['forwarded_mean'],r['grain']) for r in context['cup_summary']])
    insert('policy_periods',[('2025-26','Every Seat, Every Game','GA season ticket holders',-23,0)])
    conn.commit()
    results=[]
    for q in (ROOT/'sql/queries.sql').read_text().split(';'):
        if q.strip():
            cur=conn.execute(q)
            results.append([dict(zip([c[0] for c in cur.description],row)) for row in cur.fetchall()])
    return results

def main():
    d=pd.read_csv(ROOT/'data/processed/fixtures.csv')
    ctx=json.loads((ROOT/'data/curated/context.json').read_text())
    prices=pd.read_csv(ROOT/'data/curated/prices.csv')
    url=os.environ.get('DATABASE_URL')
    if url:
        import psycopg
        with psycopg.connect(url) as conn: result=populate(conn,d,ctx,prices,True)
        engine='postgresql'
    else:
        with sqlite3.connect(':memory:') as conn:
            conn.execute('PRAGMA foreign_keys=ON')
            result=populate(conn,d,ctx,prices)
            # Dependency order matters for PostgreSQL foreign keys.
            tables=['seasons','competitions','fixtures','ticketing_metrics','stands','ticket_prices','price_stands','competition_summaries','policy_periods']
            inserts=[s for s in conn.iterdump() if s.startswith('INSERT INTO')]
            ordered=[s for table in tables for s in inserts if s.startswith(f'INSERT INTO "{table}" ')]
            (ROOT/'sql/seed.sql').write_text('\n'.join(ordered)+'\n',encoding='utf-8')
        engine='sqlite'
    (ROOT/f'reports/sql-{engine}.json').write_text(json.dumps(result,indent=2,default=str))
    print(f'{engine}: schema, load, and {len(result)} analytical queries executed')

if __name__=='__main__': main()
