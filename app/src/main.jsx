import React, { useState, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
const Experience = lazy(() => import("./Experience.jsx"));
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
      <button onClick={() => location.reload()}>Reload</button>
    </main>
  ) : data ? (
    <Suspense fallback={<div className="load">Opening Anfield…</div>}>
      <Experience data={data} />
    </Suspense>
  ) : (
    <div className="load" role="status">
      Loading the published evidence…
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
