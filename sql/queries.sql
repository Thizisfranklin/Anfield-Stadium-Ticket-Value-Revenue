-- Published fixture counts and unused-ticket means. Scope must stay visible.
SELECT f.season, f.competition, m.scope, COUNT(*) AS fixtures,
       AVG(1.0*m.unused_tickets) AS mean_unused,
       AVG(1.0*m.forwarded_tickets) AS mean_forwarded,
       AVG(100.0*m.unused_tickets/61276) AS unused_capacity_pct
FROM fixtures f JOIN ticketing_metrics m ON m.fixture_id=f.id
GROUP BY f.season, f.competition, m.scope ORDER BY f.season;

-- Highest unused-ticket fixtures within each season.
SELECT f.season, f.opponent, m.unused_tickets,
       RANK() OVER(PARTITION BY f.season ORDER BY m.unused_tickets DESC) AS unused_rank
FROM fixtures f JOIN ticketing_metrics m ON f.id=m.fixture_id
ORDER BY f.season, unused_rank;

-- Same-opponent contrast, descriptive only: source population wording differs.
SELECT a.opponent, ma.unused_tickets AS before_unused, mb.unused_tickets AS after_unused,
       mb.unused_tickets-ma.unused_tickets AS difference
FROM fixtures a JOIN fixtures b ON a.opponent=b.opponent AND a.competition=b.competition
JOIN ticketing_metrics ma ON ma.fixture_id=a.id
JOIN ticketing_metrics mb ON mb.fixture_id=b.id
WHERE a.season='2024-25' AND b.season='2025-26' ORDER BY difference DESC;

-- Cup means remain at their published grain.
SELECT season,competition,unused_mean,forwarded_mean,grain
FROM competition_summaries ORDER BY unused_mean DESC;
