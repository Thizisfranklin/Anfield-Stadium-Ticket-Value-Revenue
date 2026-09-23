import { useState, lazy, Suspense } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import Stadium from "./Stadium.jsx";
const ArrivalMap = lazy(() => import("./ArrivalMap.jsx"));
const n = (x, d = 0) =>
  x == null
    ? "Not published"
    : Number(x).toLocaleString("en-GB", { maximumFractionDigits: d });
const tabs = [
  "Stadium",
  "Matchday",
  "Inventory flow",
  "Match context",
  "Policy review",
  "Policy lab",
  "Model evidence",
  "Decision centre",
];
const introductions = {
  Stadium:
    "Start with the place: four stands, finite capacity, and different routes into Anfield.",
  Matchday:
    "Open a match file to see how sold tickets, forwarding and unused inventory vary across the season.",
  "Inventory flow":
    "A ticket can change hands. The question is whether it ultimately brings a supporter through the gate.",
  "Match context":
    "Compare fixture settings while keeping league records, cup averages and access probabilities distinct.",
  "Policy review":
    "Read Every Seat, Every Game through the evidence: what changed, for whom, and what remains uncertain.",
  "Policy lab":
    "Explore the supporter opportunities that successful recovery of unused tickets could create.",
  "Model evidence":
    "Before forecasting the next match, ask whether the available history supports a useful prediction.",
  "Decision centre":
    "Turn the evidence into focused experiments and better measurement of supporter access.",
};
function FixtureTooltip({ active, payload, scatter = false }) {
  const f = payload?.[0]?.payload;
  if (!active || !f?.opponent) return null;
  return (
    <div className="fixture-tooltip">
      <strong>Liverpool vs {f.opponent}</strong>
      <small>
        {f.date} · {f.season} · Premier League
      </small>
      <p>
        <span>Unused sold tickets</span>
        <b>{n(f.unused_tickets)}</b>
      </p>
      {scatter && (
        <p>
          <span>Tickets forwarded</span>
          <b>{n(f.forwarded_tickets)}</b>
        </p>
      )}
      <small>
        LFC publication · {scatter ? "pp7–8" : `p${f.source_page}`} ·
        fixture-level counts
      </small>
    </div>
  );
}
function Metric({ value, label, detail }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
function Heading({ index, title, children }) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">EVIDENCE / {index}</span>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}
function Note({ children }) {
  return <div className="note">{children}</div>;
}
function Evidence({ data, season, page }) {
  return (
    <a
      className="source"
      href={`${data.source_links[season]}#page=${page}`}
      target="_blank"
      rel="noreferrer"
    >
      LFC {season} ticketing publication · PDF p{page} ↗
    </a>
  );
}
function ChartTable({ rows, columns, caption }) {
  return (
    <details className="table-alt">
      <summary>View accessible data table</summary>
      <div className="table-scroll">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map(([key, label]) => (
                <th key={key}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {columns.map(([key]) => (
                  <td key={key}>
                    {typeof r[key] === "number" ? n(r[key], 2) : r[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
export default function Experience({ data }) {
  const [entered, setEntered] = useState(false),
    [tab, setTab] = useState("Stadium"),
    [season, setSeason] = useState("2025-26"),
    [fixtureId, setFixtureId] = useState("2025-26-16"),
    [standId, setStandId] = useState("kop"),
    [recovery, setRecovery] = useState(25),
    [competition, setCompetition] = useState("All competitions");
  const fixtures = data.fixtures.filter((f) => f.season === season),
    fixture = fixtures.find((f) => f.id === fixtureId) || fixtures[0],
    summary = data.season_summary.find((s) => s.season === season),
    stand = data.stands.find((s) => s.id === standId),
    scenario = fixture.scenarios.find((s) => s.recovery_percent === recovery);
  const changeSeason = (s) => {
    setSeason(s);
    setFixtureId(data.fixtures.find((f) => f.season === s).id);
  };
  const enter = () => {
    setTab("Stadium");
    setEntered(true);
    window.scrollTo(0, 0);
    setTimeout(() => document.getElementById("analysis-title")?.focus(), 0);
  };
  const chooseTab = (t) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(
      () =>
        document
          .getElementById("analysis-title")
          ?.focus({ preventScroll: true }),
      0,
    );
  };
  if (!entered)
    return (
      <main className="arrival">
        <Suspense fallback={<div className="arrival-map" />}>
          <ArrivalMap />
        </Suspense>
        <div className="arrival-shade" />
        <header className="arrival-header">
          <a className="wordmark" href="#">
            AMI<span> / INDEPENDENT RESEARCH</span>
          </a>
          <span className="edition">ANFIELD · LIVERPOOL, UK</span>
        </header>
        <div className="hero-copy">
          <div className="eyebrow">
            <i /> MERSEYSIDE / LIVERPOOL / ANFIELD
          </div>
          <h1>
            ANFIELD
            <span>
              MATCHDAY
              <br />
              INTELLIGENCE
            </span>
          </h1>
          <p className="subtitle">
            Ticket Utilization, Fan Access &amp; Revenue Analytics
          </p>
          <p className="hero-description">
            A sold-out stadium. A seat still empty.
            <br />
            Explore the gap between tickets sold and supporters through the
            gates.
          </p>
          <button className="primary" onClick={enter}>
            Enter analysis <span>↗</span>
          </button>
          <div className="hero-stats">
            <div>
              <strong>{n(data.capacity)}</strong>
              <span>Physical seats · official capacity</span>
            </div>
            <div>
              <strong>{data.fixtures.length}</strong>
              <span>Published league fixture records</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Seasons of ticketing evidence</span>
            </div>
          </div>
        </div>
        <footer className="arrival-footer">
          <span>2024–25 / 2025–26</span>
          <span>PUBLIC DATA. CLEAR BOUNDARIES.</span>
          <a
            href={data.source_links["2025-26"]}
            target="_blank"
            rel="noreferrer"
          >
            Explore the source ↗
          </a>
        </footer>
      </main>
    );
  return (
    <div className="shell">
      <a className="skip" href="#content">
        Skip to analysis
      </a>
      <header className="topbar">
        <button
          className="wordmark"
          onClick={() => setEntered(false)}
          aria-label="Return to arrival"
        >
          AMI<span> / ANFIELD MATCHDAY INTELLIGENCE</span>
        </button>
        <span className="evidence-status">
          <i /> PUBLIC EVIDENCE / {data.as_of}
        </span>
      </header>
      <div className="workspace">
        <aside>
          <div className="side-title">
            ANFIELD / THE EVIDENCE
            <br />
            <b>From seat to supporter</b>
          </div>
          <nav aria-label="Analysis sections">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => chooseTab(t)}
                aria-current={tab === t ? "page" : undefined}
              >
                <span>0{i + 1}</span>
                {t}
                <em>↗</em>
              </button>
            ))}
          </nav>
          <div className="sidebar-note">
            <b>
              One stadium.
              <br />
              Different levels of evidence.
            </b>
            <p>
              Fixture metrics stay at fixture level. Stands show verified
              structure and price context.
            </p>
            <a
              href={data.source_links["2025-26"]}
              target="_blank"
              rel="noreferrer"
            >
              Source publication ↗
            </a>
          </div>
        </aside>
        <main id="content">
          <div className="page-intro">
            <div className="eyebrow">
              CHAPTER {String(tabs.indexOf(tab) + 1).padStart(2, "0")} / 08 ·
              ANFIELD
            </div>
            <h1 id="analysis-title" tabIndex="-1">
              {tab}
            </h1>
            <p>{introductions[tab]}</p>
          </div>
          {["Matchday", "Policy lab", "Match context"].includes(tab) && (
            <div className="controls">
              <label htmlFor="season-select">
                Season
                <select
                  id="season-select"
                  value={season}
                  onChange={(e) => changeSeason(e.target.value)}
                >
                  <option>2025-26</option>
                  <option>2024-25</option>
                </select>
              </label>
              {tab !== "Match context" && (
                <label className="fixture-control" htmlFor="fixture-select">
                  Home fixture
                  <select
                    id="fixture-select"
                    value={fixture.id}
                    onChange={(e) => setFixtureId(e.target.value)}
                  >
                    {fixtures.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.opponent} · {f.date}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <span className="grain">
                {tab === "Match context"
                  ? "CONTEXT COMPARISONS"
                  : "GRAIN / ONE LEAGUE FIXTURE"}
              </span>
            </div>
          )}
          {tab === "Matchday" && (
            <>
              <section className="fixture-banner">
                <div>
                  <span className="eyebrow">PREMIER LEAGUE / HOME</span>
                  <h2>
                    Liverpool <span>vs</span> {fixture.opponent}
                  </h2>
                  <p>
                    {fixture.date} <b>·</b> {fixture.weekday} <b>·</b>{" "}
                    {fixture.kickoff} UK local time
                  </p>
                </div>
                <div className="fixture-stamp">
                  ANFIELD
                  <br />
                  <span>MATCH FILE</span>
                </div>
              </section>
              <div className="metrics">
                <Metric
                  value={n(fixture.unused_tickets)}
                  label="Sold tickets unused"
                  detail={
                    season === "2025-26"
                      ? "Published home-ticket scope"
                      : "Published all-stadium scope"
                  }
                />
                <Metric
                  value={n(fixture.forwarded_tickets)}
                  label="Tickets forwarded"
                  detail={
                    season === "2025-26"
                      ? "GA ticket forwarding · source p8"
                      : "No fixture-level series for this season"
                  }
                />
                <Metric
                  value={`${n(fixture.unused_capacity_pct, 2)}%`}
                  label="Unused / physical capacity"
                  detail="Context ratio, not an occupancy rate"
                />
              </div>
              <div className="panel">
                <Heading
                  index="02"
                  title="Every fixture tells a different story"
                >
                  Select a bar to open that match file. Counts represent
                  published unused sold tickets.
                </Heading>
                <div className="chart-key">
                  <span>Unused sold tickets · count</span>
                  <span className="selected-key">Selected match</span>
                </div>
                <div className="chart">
                  <ResponsiveContainer>
                    <BarChart
                      data={fixtures}
                      onClick={(s) => {
                        if (s?.activeLabel) {
                          const f = fixtures.find(
                            (f) => f.opponent === s.activeLabel,
                          );
                          if (f) setFixtureId(f.id);
                        }
                      }}
                      margin={{ bottom: 40, left: 0, right: 10 }}
                    >
                      <CartesianGrid vertical={false} stroke="#263740" />
                      <XAxis
                        dataKey="opponent"
                        tick={{ fill: "#a6b9c0", fontSize: 11 }}
                        angle={-35}
                        textAnchor="end"
                        interval="preserveStartEnd"
                        minTickGap={18}
                        height={80}
                      />
                      <YAxis tick={{ fill: "#a6b9c0", fontSize: 12 }} />
                      <Tooltip
                        content={<FixtureTooltip />}
                        cursor={{ fill: "#ffffff08" }}
                      />
                      <Bar
                        dataKey="unused_tickets"
                        name="Unused tickets"
                        fill="#55d7bd"
                        radius={[3, 3, 0, 0]}
                        isAnimationActive={false}
                      >
                        {fixtures.map((f) => (
                          <Cell
                            key={f.id}
                            fill={f.id === fixture.id ? "#edc985" : "#55d7bd"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ChartTable
                  rows={fixtures}
                  columns={[
                    ["opponent", "Opponent"],
                    ["date", "Date"],
                    ["unused_tickets", "Unused tickets"],
                  ]}
                  caption={`${season} published fixture values`}
                />
                <Evidence
                  data={data}
                  season={season}
                  page={fixture.source_page}
                />
              </div>
              <Note>
                Exact tickets sold and turnstile attendance are not published
                here. Physical capacity includes operationally unavailable
                seats. Subtracting unused tickets from 61,276 would not
                establish attendance.
              </Note>
            </>
          )}
          {tab === "Stadium" && (
            <>
              <Heading index="01" title="Four stands. One Anfield.">
                Select a stand with your pointer, or tab to it and press Enter.
                Price categories are current 2026–27 context.
              </Heading>
              <div className="stadium-layout">
                <div className="panel stadium-panel">
                  <Stadium
                    stands={data.stands}
                    selected={standId}
                    onSelect={setStandId}
                  />
                  <div
                    className="stand-selector"
                    role="group"
                    aria-label="Choose an Anfield stand"
                  >
                    {data.stands.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStandId(s.id)}
                        aria-pressed={standId === s.id}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="stadium-caption">
                    <span>Selected stand</span>
                    <strong>{stand.name}</strong>
                    <small>Structure &amp; current price context only</small>
                  </div>
                </div>
                <section className="panel stand-info" aria-live="polite">
                  <span className="eyebrow">STAND / VERIFIED CONTEXT</span>
                  <h2>{stand.name}</h2>
                  <p>
                    {stand.tiers} {stand.tiers === 1 ? "tier" : "tiers"} ·
                    Official access statement, March 2026
                  </p>
                  <div className="rule" />
                  <span className="eyebrow">2026–27 PL GENERAL ADMISSION</span>
                  <table>
                    <caption>
                      Published price bands containing this stand
                    </caption>
                    <thead>
                      <tr>
                        <th>Band</th>
                        <th>Adult</th>
                        <th>Junior</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.prices
                        .filter((p) => p.stands.split("|").includes(stand.name))
                        .map((p) => (
                          <tr key={p.band}>
                            <td>{p.band}</td>
                            <td>£{p.adult_gbp.toFixed(2)}</td>
                            <td>£{p.junior_gbp.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="muted">
                    Bands can span several stands. Bands 11–12 have special
                    pricing; consult official eligibility and seating details
                    before purchase.
                  </p>
                  <a
                    className="source"
                    href={data.source_links.prices}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official price table ↗
                  </a>
                  <p>
                    Accessible drop-off context: <b>{stand.drop_off}</b>.
                  </p>
                  <a
                    className="source"
                    href={data.source_links.access}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official access guide · pp1,6 ↗
                  </a>
                </section>
              </div>
              <Note>
                Unused tickets and forwarding are not available by stand. This
                schematic therefore carries no utilization heatmap. Current
                prices are not applied to historical fixtures or used to
                estimate revenue.
              </Note>
            </>
          )}
          {tab === "Inventory flow" && (
            <>
              <Heading index="03" title="From allocation to arrival">
                A process diagram. Connections explain possible routes; widths
                do not represent quantities.
              </Heading>
              <div className="flow-panel panel">
                <div className="flow-row">
                  <div className="flow-node">
                    Physical stadium<strong>{n(data.capacity)} seats</strong>
                    <small>Some seats unavailable operationally</small>
                  </div>
                  <span>→</span>
                  <div className="flow-node">
                    Initial allocation<strong>Ticket purchaser</strong>
                    <small>Season tickets · members · other groups</small>
                  </div>
                </div>
                <div className="flow-junction">
                  <span>Possible routes after purchase</span>
                  <b aria-hidden="true">↓</b>
                </div>
                <div className="flow-branches">
                  <div className="flow-node">
                    Can attend<strong>Ticket used</strong>
                  </div>
                  <div className="flow-node accent">
                    Cannot attend<strong>Forward to another supporter</strong>
                    <small>Forwarding does not prove attendance</small>
                  </div>
                  <div className="flow-node accent">
                    League tickets<strong>Official Ticket Exchange</strong>
                    <small>Listing → resale → possible attendance</small>
                  </div>
                  <div className="flow-node warning">
                    No successful use<strong>Sold ticket unused</strong>
                  </div>
                </div>
                <span className="eyebrow">
                  STRUCTURAL PROCESS · NOT A QUANTITATIVE SANKEY
                </span>
              </div>
              <div className="two-col">
                <div className="panel">
                  <Metric
                    value={n(data.exchange.members_purchased_mean)}
                    label="Member purchases through exchange"
                    detail="2024–25 mean per Premier League home game"
                  />
                  <p>
                    The publication reports purchases by members, but not
                    listings, time-to-resale, or the share that went unsold.
                    Exchange conversion cannot be calculated.
                  </p>
                  <Evidence data={data} season="2024-25" page={4} />
                </div>
                <div className="panel">
                  <h3>The cup constraint</h3>
                  <p>
                    The 2025–26 publication says Ticket Exchange is unavailable
                    for cup competitions. Forwarding remains available, with the
                    original purchaser retaining the cup credit.
                  </p>
                  <Evidence data={data} season="2025-26" page={10} />
                </div>
              </div>
              <Note>
                These routes are not mutually exclusive observed cohorts. The
                publications do not reveal whether a forwarded ticket was used,
                or trace tickets from their original allocation to their final
                outcome.
              </Note>
            </>
          )}
          {tab === "Match context" && (
            <>
              <Heading index="04" title="Context before conclusions">
                League records and cup averages have different grains. The
                comparison below uses published competition means only.
              </Heading>
              <label className="inline-filter" htmlFor="competition-select">
                Competition
                <select
                  id="competition-select"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                >
                  {[
                    "All competitions",
                    "Premier League",
                    "FA Cup",
                    "Carabao Cup",
                    "Champions League",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              {season === "2024-25" && (
                <Note>
                  Cup unused-ticket and forwarding averages are not published
                  for 2024–25. No cup observations are imputed.
                </Note>
              )}
              <div className="panel">
                <div className="competition-grid">
                  {[summary, ...(season === "2025-26" ? data.cup_summary : [])]
                    .filter(
                      (c) =>
                        competition === "All competitions" ||
                        c.competition === competition,
                    )
                    .map((c) => (
                      <div className="competition-card" key={c.competition}>
                        <span className="eyebrow">{c.competition}</span>
                        <strong>{n(c.unused_mean)}</strong>
                        <p>Mean unused tickets / game</p>
                        <div className="mini-track">
                          <span
                            style={{
                              width: `${(c.unused_mean / 6000) * 100}%`,
                            }}
                          />
                        </div>
                        <small>
                          {c.n
                            ? `${c.n} league records`
                            : "Published cup mean · fixture counts not provided"}
                          <br />
                          Forwarded: {n(c.forwarded_mean)} / game
                        </small>
                      </div>
                    ))}
                </div>
                <Evidence
                  data={data}
                  season={season}
                  page={season === "2025-26" ? 7 : 5}
                />
                {season === "2025-26" && (
                  <>
                    <br />
                    <Evidence data={data} season={season} page={10} />
                  </>
                )}
                {season === "2024-25" &&
                  competition !== "All competitions" &&
                  competition !== "Premier League" && (
                    <p>No published observations at this grain.</p>
                  )}
              </div>
              <div className="two-col">
                <div className="panel">
                  <h3>League fixtures · weekday / weekend</h3>
                  {data.weekday_summary
                    .filter((x) => x.season === season)
                    .map((x) => (
                      <div className="stat-row" key={x.group}>
                        <span>
                          {x.group} <small>n={x.n}</small>
                        </span>
                        <strong>
                          {n(x.unused_mean)} <small>mean unused</small>
                        </strong>
                      </div>
                    ))}
                  <p className="muted">
                    Small groups; calendar and opponent mix are intertwined.
                    These are descriptive differences.
                  </p>
                </div>
                <div className="panel">
                  <h3>Access is not one probability</h3>
                  {data.member_access
                    .filter((x) => x.season === season)
                    .map((x) => (
                      <div key={x.season}>
                        <Metric
                          value={`${x.successful_applicants_pct}%`}
                          label="Applicants obtaining a ticket across the season"
                        />
                        <p>
                          Individual open-ballot success:{" "}
                          <b>{x.open_ballot_success_pct}%</b>. Restricted 4–12
                          credit ballot:{" "}
                          <b>{x.restricted_ballot_success_pct}%</b>.
                        </p>
                        <p className="muted">
                          Different denominators and eligibility. Season-wide
                          success is not the chance of winning one ballot.
                        </p>
                        <Evidence
                          data={data}
                          season={season}
                          page={x.source_page}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {season === "2025-26" && (
                <div className="panel">
                  <h3>Forwarding and unused tickets</h3>
                  <div className="chart-key">
                    <span>Unused sold tickets · count</span>
                    <span>Each point is one league fixture</span>
                  </div>
                  <div className="chart">
                    <ResponsiveContainer>
                      <ScatterChart
                        margin={{ left: 15, bottom: 25, right: 20 }}
                      >
                        <CartesianGrid stroke="#263740" />
                        <XAxis
                          type="number"
                          dataKey="forwarded_tickets"
                          name="Forwarded"
                          domain={["dataMin - 300", "dataMax + 300"]}
                          tick={{ fill: "#a6b9c0" }}
                          label={{
                            value: "Forwarded tickets",
                            position: "bottom",
                            fill: "#a6b9c0",
                          }}
                        />
                        <YAxis
                          type="number"
                          dataKey="unused_tickets"
                          name="Unused"
                          tick={{ fill: "#a6b9c0" }}
                        />
                        <Tooltip
                          content={<FixtureTooltip scatter />}
                          cursor={{ strokeDasharray: "3 3" }}
                        />
                        <Scatter
                          data={fixtures}
                          fill="#55d7bd"
                          name="League fixtures"
                          isAnimationActive={false}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartTable
                    rows={fixtures}
                    columns={[
                      ["opponent", "Opponent"],
                      ["forwarded_tickets", "Forwarded"],
                      ["unused_tickets", "Unused"],
                    ]}
                    caption="2025–26 fixture context"
                  />
                  <p className="muted">
                    Association cannot tell us whether forwarding prevented
                    empty seats. Both variables are realized matchday outcomes.
                  </p>
                  <Evidence data={data} season="2025-26" page={7} />
                  <br />
                  <Evidence data={data} season="2025-26" page={8} />
                </div>
              )}
            </>
          )}
          {tab === "Policy review" && (
            <>
              <Heading index="05" title="A policy signal. A careful reading.">
                Every Seat, Every Game began in 2025–26 for general-admission
                season-ticket holders.
              </Heading>
              <div className="policy-highlight">
                <span className="eyebrow">
                  CLUB-REPORTED / SPECIFIC SUBGROUP
                </span>
                <strong>−23%</strong>
                <div>
                  <h3>Fewer empty GA season-ticket seats</h3>
                  <p>
                    A published observation following the policy change. It does
                    not isolate the policy’s causal effect.
                  </p>
                  <Evidence data={data} season="2025-26" page={11} />
                </div>
              </div>
              <div className="metrics">
                <Metric
                  value={n(data.policy.before_mean, 1)}
                  label="2024–25 mean unused"
                  detail="All-stadium wording · 19 fixtures"
                />
                <Metric
                  value={n(data.policy.after_mean, 1)}
                  label="2025–26 mean unused"
                  detail="Home-ticket wording · 19 fixtures"
                />
                <Metric
                  value={`+${n(data.policy.relative_change_pct, 2)}%`}
                  label="Raw published-series difference"
                  detail={`+${n(data.policy.absolute_change, 2)} tickets per game · definition-sensitive`}
                />
              </div>
              <Note>{data.policy.caution}</Note>
              <div className="two-col">
                <div className="panel">
                  <h3>Match the opponents</h3>
                  <Metric
                    value={n(data.policy.paired_mean_change, 2)}
                    label="Mean same-opponent difference"
                    detail={`${data.policy.comparable_opponents} common opponents · after minus before`}
                  />
                  <p>
                    Opponent bootstrap 95% interval:{" "}
                    <b>
                      {n(data.policy.paired_bootstrap_95[0], 2)} to{" "}
                      {n(data.policy.paired_bootstrap_95[1], 2)}
                    </b>{" "}
                    tickets. Seed 42; 10,000 resamples.
                  </p>
                  <p className="muted">
                    This interval describes sensitivity across opponents. The
                    seasons are complete observed sets, not randomized samples,
                    and the target definition remains uncertain.
                  </p>
                </div>
                <div className="panel">
                  <h3>What else changed?</h3>
                  <ul className="spaced-list">
                    <li>Opponent mix, match dates and kickoff times.</li>
                    <li>Team performance and incentives late in the season.</li>
                    <li>
                      Friends &amp; Family limits, forwarding rules and
                      anti-touting action.
                    </li>
                    <li>Possible differences in reporting scope.</li>
                  </ul>
                  <p>
                    Stronger identification needs consistent ticket-level
                    attendance, eligible and comparison groups, multiple
                    pre-policy seasons, and policy exposure records.
                  </p>
                </div>
              </div>
              <div className="panel">
                <h3>Compliance is not the same as attendance</h3>
                <p>
                  The March 2025 announcement set a 15-home-league-game usage
                  threshold. Under that announcement, listing on the exchange or
                  forwarding counted toward compliance; an exchange listing
                  could qualify even if unsold. Measure actual gate entry
                  separately.
                </p>
                <a
                  className="source"
                  href="https://www.liverpoolfc.com/news/season-ticket-renewals-confirmed-new-every-seat-every-game-initiative"
                  target="_blank"
                  rel="noreferrer"
                >
                  Original policy announcement ↗
                </a>
              </div>
            </>
          )}
          {tab === "Policy lab" && (
            <>
              <Heading
                index="06"
                title="What if more tickets found a supporter?"
              >
                An access scenario for the selected fixture. Change the recovery
                assumption to explore a hypothetical outcome.
              </Heading>
              <div className="scenario-label">SCENARIO — NOT OBSERVED DATA</div>
              <div className="panel scenario-panel">
                <span className="eyebrow">
                  LIVERPOOL vs {fixture.opponent.toUpperCase()} / {fixture.date}
                </span>
                <h3>
                  Recover a share of {n(fixture.unused_tickets)} unused sold
                  tickets
                </h3>
                <div className="slider-label">
                  <label htmlFor="recovery">Assumed successful recovery</label>
                  <output htmlFor="recovery">{recovery}%</output>
                </div>
                <input
                  id="recovery"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={recovery}
                  onChange={(e) => setRecovery(Number(e.target.value))}
                />
                <div className="slider-ends">
                  <span>0% · no recovery</span>
                  <span>100% · theoretical upper bound</span>
                </div>
                <div className="metrics">
                  <Metric
                    value={n(scenario.additional_opportunities, 2)}
                    label="Additional supporter opportunities"
                    detail="Expected opportunities; fractional results are arithmetic"
                  />
                  <Metric
                    value={n(scenario.remaining_unused, 2)}
                    label="Remaining unused tickets"
                  />
                  <Metric
                    value={`+${n(scenario.capacity_percentage_points, 2)} pp`}
                    label="Share of physical capacity recovered"
                    detail="Not a measured utilization increase"
                  />
                </div>
                <div
                  className="recovery-track"
                  role="img"
                  aria-label={`Scenario: ${recovery}% successfully recovered; ${100 - recovery}% remaining unused`}
                >
                  <span style={{ width: `${recovery}%` }} />
                </div>
                <div className="chart-key">
                  <span className="selected-key">
                    Assumed recovered &amp; used
                  </span>
                  <span>Remaining unused</span>
                </div>
                <button className="text-button" onClick={() => setRecovery(25)}>
                  Reset assumption to 25%
                </button>
              </div>
              <Note>
                The assumption is successful recovery and use, not merely a
                listing or forward. No behavioral response or operational
                feasibility is estimated. Sold-but-unused tickets have already
                generated sales: recovering one does not automatically create
                incremental ticket revenue.
              </Note>
              <div className="panel">
                <h3>Revenue needs a different evidence base</h3>
                <p>
                  Refunds, resale rules, ticket type, concessions, taxes, costs
                  and ancillary spend are unavailable. Multiplying unused
                  tickets by an adult list price would misrepresent lost
                  revenue. This lab therefore quantifies supporter opportunities
                  only.
                </p>
              </div>
            </>
          )}
          {tab === "Model evidence" && (
            <>
              <Heading index="07" title="Does a model earn its place?">
                A small forward-only benchmark tests whether pre-match context
                improves on simple baselines.
              </Heading>
              <div className="panel">
                <div className="eyebrow">
                  TARGET / UNUSED HOME TICKETS · 2025–26 ONLY
                </div>
                <table>
                  <caption>
                    Held-out performance: lower error is better (tickets)
                  </caption>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>MAE</th>
                      <th>RMSE</th>
                      <th>Test fixtures</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.model.scores.map((s) => (
                      <tr key={s.model}>
                        <td>{s.model.replaceAll("_", " ")}</td>
                        <td>{n(s.mae, 2)}</td>
                        <td>{n(s.rmse, 2)}</td>
                        <td>{s.n_test}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>{data.model.validation}</p>
              </div>
              <div className="two-col">
                <div className="panel">
                  <h3>Why no ARIMA?</h3>
                  <p>{data.model.decision}</p>
                  <p>
                    Gaps between fixtures range from{" "}
                    <b>
                      {data.model.interval_days_min} to{" "}
                      {data.model.interval_days_max} days
                    </b>
                    . One comparable season cannot establish recurring annual
                    seasonality. No stationarity test is treated as decisive
                    with this sample.
                  </p>
                </div>
                <div className="panel">
                  <h3>Leakage boundary</h3>
                  <p>
                    Inputs: weekend flag, scheduled kickoff hour,
                    restricted-ballot eligibility. Scaling is learned within
                    each training window.
                  </p>
                  <p>
                    Excluded: match results, realized forwarding, exchange
                    outcomes and post-match attendance. Final schedule data may
                    include rescheduling; this is not a booking-date backtest.
                  </p>
                  <p className="muted">
                    No operational future-fixture prediction is deployed.
                    Collect more comparable seasons and evaluate interval
                    calibration before using a model for decisions.
                  </p>
                </div>
              </div>
            </>
          )}
          {tab === "Decision centre" && (
            <>
              <Heading
                index="08"
                title="Turn evidence into the next good question"
              >
                Decisions should improve access while preserving uncertainty
                about behavior and economics.
              </Heading>
              <div className="decision-list">
                <article>
                  <span>01 / ACCESS</span>
                  <h3>Test cup attendance reminders</h3>
                  <p>
                    Published 2025–26 cup unused-ticket means exceed the league
                    mean. Cup exchange is unavailable; measure whether timely
                    reminders and easier forwarding increase actual attendance.
                  </p>
                  <small>
                    Measure: gate entry, delivery success, forwarding
                    completion. Randomize within eligibility groups where
                    feasible.
                  </small>
                </article>
                <article>
                  <span>02 / POLICY</span>
                  <h3>Track the affected group separately</h3>
                  <p>
                    The reported GA season-ticket decline and the overall
                    unused-ticket series answer different questions. Request
                    consistent population definitions before evaluating policy
                    impact.
                  </p>
                  <small>
                    Measure: GA season-ticket usage and gate entry, comparison
                    groups, concurrent policy exposure.
                  </small>
                </article>
                <article>
                  <span>03 / OPERATIONS</span>
                  <h3>Measure the exchange funnel</h3>
                  <p>
                    Member exchange purchases show a real access route. Listings
                    and resale outcomes are needed to identify where that route
                    loses tickets.
                  </p>
                  <small>
                    Measure: listing time, eligibility, time-to-resale, unsold
                    inventory and final attendance.
                  </small>
                </article>
                <article>
                  <span>04 / MODELLING</span>
                  <h3>Keep the simple benchmark</h3>
                  <p>
                    The context model did not improve held-out error here.
                    Gather comparable fixture history before adding complexity
                    or forecasting future demand.
                  </p>
                  <small>
                    Measure: prospective errors, subgroup stability and
                    calibrated uncertainty.
                  </small>
                </article>
              </div>
              <Note>
                Independent portfolio research, not affiliated with Liverpool
                FC. No estimate of the club’s internal economics is claimed.
              </Note>
              <div className="panel">
                <h3>Evidence library</h3>
                <div className="source-list">
                  {Object.entries(data.source_links).map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noreferrer">
                      {name} ↗
                    </a>
                  ))}
                  <a
                    href="https://www.football-data.co.uk/englandm.php"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Fixture context provider ↗
                  </a>
                </div>
              </div>
            </>
          )}
          <div
            className="chapter-navigation"
            aria-label="Continue the evidence story"
          >
            <span>{String(tabs.indexOf(tab) + 1).padStart(2, "0")} / 08</span>
            {tabs.indexOf(tab) > 0 && (
              <button
                className="text-button"
                onClick={() => chooseTab(tabs[tabs.indexOf(tab) - 1])}
              >
                ← Previous chapter
              </button>
            )}
            {tabs.indexOf(tab) < tabs.length - 1 ? (
              <button
                className="next-chapter"
                onClick={() => chooseTab(tabs[tabs.indexOf(tab) + 1])}
              >
                <small>CONTINUE THE STORY</small>
                {tabs[tabs.indexOf(tab) + 1]} <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                className="next-chapter"
                onClick={() => chooseTab("Stadium")}
              >
                <small>RETURN TO THE START</small>Explore Anfield again{" "}
                <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>
          <footer className="analysis-footer">
            <span>ANFIELD MATCHDAY INTELLIGENCE</span>
            <span>
              Independent analysis · Official LFC ticketing sources +
              Football-Data fixture context
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
