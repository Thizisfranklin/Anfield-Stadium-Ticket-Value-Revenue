import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const dir = process.argv[2] || "../work/visual-review";
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const pages = [
  "Stadium",
  "Matchday",
  "Inventory flow",
  "Match context",
  "Policy review",
  "Policy lab",
  "Model evidence",
  "Decision centre",
];
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4173");
  await page.getByRole("button", { name: "Enter analysis" }).waitFor();
  await page.waitForTimeout(3500);
  await page.screenshot({
    path: `${dir}/${name}-arrival.png`,
    fullPage: name === "desktop",
  });
  await page.getByRole("button", { name: "Enter analysis" }).click();
  for (const [i, title] of pages.entries()) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: new RegExp(title) })
      .click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `${dir}/${name}-${i + 1}.png`,
      fullPage: true,
    });
  }
  await page.close();
}
await browser.close();
console.log(
  "Captured arrival and all eight views at desktop and mobile widths.",
);
