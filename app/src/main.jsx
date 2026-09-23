import React, { useState, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
const Experience = lazy(() => import("./Experience.jsx"));
function LoadingEvidence() {
  return (
    <main className="load" role="status">
      <span className="eyebrow">ANFIELD MATCHDAY INTELLIGENCE</span>
      <h1>Opening the match files</h1>
      <p>Loading published ticketing evidence…</p>
    </main>
  );
}
function App() {
  const [data, setData] = useState(null),
    [error, setError] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/intelligence.json`)
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => {
        if (d.schema_version !== "1.0" || d.fixtures.length !== 38)
          throw Error();
        setData(d);
      })
      .catch(() => setError(true));
  }, []);
  return error ? (
    <main className="load">
      <h1>Evidence unavailable</h1>
      <p>The analysis data could not be loaded. Please reload to try again.</p>
      <button className="primary" onClick={() => location.reload()}>
        Reload
      </button>
    </main>
  ) : data ? (
    <Suspense fallback={<LoadingEvidence />}>
      <Experience data={data} />
    </Suspense>
  ) : (
    <LoadingEvidence />
  );
}
createRoot(document.getElementById("root")).render(<App />);
