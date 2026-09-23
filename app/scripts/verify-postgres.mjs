import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(await fs.readFile("../sql/schema.sql", "utf8"));
await db.exec(await fs.readFile("../sql/seed.sql", "utf8"));
const results = await db.exec(await fs.readFile("../sql/queries.sql", "utf8"));
const reference = JSON.parse(
  await fs.readFile("../reports/sql-sqlite.json", "utf8"),
);
assert.equal(results.length, reference.length);
results.forEach((r, i) => {
  assert.equal(r.rows.length, reference[i].length);
  r.rows.forEach((row, j) =>
    Object.entries(row).forEach(([key, value]) => {
      const expected = reference[i][j][key];
      if (typeof expected === "number")
        assert.ok(
          Math.abs(Number(value) - expected) < 1e-7,
          `${key}: ${value} != ${expected}`,
        );
      else assert.equal(value, expected);
    }),
  );
});
const version = await db.query("SELECT version()");
await fs.writeFile(
  "../reports/sql-postgres-wasm.json",
  JSON.stringify(
    {
      engine: version.rows[0],
      queries: results.map((x) => x.rows),
      verified_against_sqlite: true,
    },
    null,
    2,
  ),
);
await db.close();
console.log(
  "PostgreSQL WASM: schema, foreign keys, seed, and all 4 query outputs match SQLite.",
);
