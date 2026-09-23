CREATE TABLE seasons (season TEXT PRIMARY KEY);
CREATE TABLE competitions (competition TEXT PRIMARY KEY);
CREATE TABLE fixtures (
 id TEXT PRIMARY KEY,
 season TEXT NOT NULL REFERENCES seasons(season),
 competition TEXT NOT NULL REFERENCES competitions(competition),
 opponent TEXT NOT NULL,
 match_date DATE NOT NULL,
 kickoff TEXT NOT NULL,
 UNIQUE(season, competition, opponent)
);
CREATE TABLE ticketing_metrics (
 fixture_id TEXT PRIMARY KEY REFERENCES fixtures(id),
 unused_tickets INTEGER NOT NULL CHECK(unused_tickets BETWEEN 0 AND 61276),
 forwarded_tickets INTEGER CHECK(forwarded_tickets BETWEEN 0 AND 61276),
 scope TEXT NOT NULL CHECK(scope IN ('all_stadium_tickets','home_tickets')),
 source TEXT NOT NULL,
 source_page INTEGER NOT NULL,
 grain TEXT NOT NULL CHECK(grain='fixture')
);
CREATE TABLE stands (stand_id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, tiers INTEGER NOT NULL);
CREATE TABLE ticket_prices (
 season TEXT NOT NULL, band INTEGER NOT NULL, adult_gbp NUMERIC(6,2) NOT NULL CHECK(adult_gbp>=0),
 over65_gbp NUMERIC(6,2) NOT NULL, young_adult_gbp NUMERIC(6,2) NOT NULL, junior_gbp NUMERIC(6,2) NOT NULL,
 PRIMARY KEY(season,band)
);
CREATE TABLE price_stands (
 season TEXT NOT NULL, band INTEGER NOT NULL, stand_id TEXT NOT NULL REFERENCES stands(stand_id),
 PRIMARY KEY(season,band,stand_id), FOREIGN KEY(season,band) REFERENCES ticket_prices(season,band)
);
CREATE TABLE competition_summaries (
 season TEXT NOT NULL REFERENCES seasons(season), competition TEXT NOT NULL REFERENCES competitions(competition),
 unused_mean INTEGER NOT NULL, forwarded_mean INTEGER NOT NULL,
 grain TEXT NOT NULL CHECK(grain='season_competition'), PRIMARY KEY(season,competition)
);
CREATE TABLE policy_periods (
 season TEXT PRIMARY KEY REFERENCES seasons(season), policy TEXT NOT NULL, population TEXT NOT NULL,
 reported_change_pct NUMERIC(6,2), causal_claim INTEGER NOT NULL CHECK(causal_claim=0)
);
