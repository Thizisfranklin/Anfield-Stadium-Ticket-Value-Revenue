import { test, expect } from "@playwright/test";
test("desktop journey, evidence boundaries and linked controls", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Enter analysis" }),
  ).toBeVisible();
  await expect(page.locator(".maplibregl-canvas")).toBeVisible();
  await page.waitForTimeout(4000); // Complete the deliberately short geographic arrival before visual capture.
  await page.screenshot({
    path: "../reports/figures/arrival-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Enter analysis" }).click();
  await expect(
    page.getByRole("heading", { name: "Liverpool vs Fulham" }),
  ).toBeVisible();
  await expect(
    page.locator(".metric strong").filter({ hasText: "2,820" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Season", exact: true })
    .selectOption("2024-25");
  await expect(page.getByText("Not published", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stadium", exact: false }).click();
  await page
    .getByRole("button", { name: "Select Main Stand", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Main Stand", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("£62.75", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "../reports/figures/stadium-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Policy lab", exact: false }).click();
  await page
    .getByRole("combobox", { name: "Season", exact: true })
    .selectOption("2025-26");
  await page
    .getByRole("combobox", { name: "Home fixture", exact: true })
    .selectOption("2025-26-16");
  await page.getByLabel("Assumed successful recovery").fill("50");
  await expect(page.getByText("1,410", { exact: true })).toHaveCount(2);
  await expect(
    page.getByText("SCENARIO — NOT OBSERVED DATA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset assumption to 25%" }).click();
  await expect(page.getByLabel("Assumed successful recovery")).toHaveValue(
    "25",
  );
  for (const tab of [
    "Inventory flow",
    "Match context",
    "Policy review",
    "Model evidence",
    "Decision centre",
  ]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: new RegExp(tab) })
      .click();
    await expect(page.locator("#analysis-title")).toHaveText(tab);
  }
  expect(errors).toEqual([]);
});
test("mobile and reduced motion remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter analysis" }).click();
  await page.screenshot({
    path: "../reports/figures/matchday-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  for (const tab of [
    "Stadium",
    "Policy review",
    "Policy lab",
    "Model evidence",
  ]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: new RegExp(tab) })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await expect(
    page.getByRole("heading", { name: "Why no ARIMA?" }),
  ).toBeVisible();
});
test("data failure presents a recovery path", async ({ page }) => {
  await page.route("**/data/intelligence.json", (r) => r.abort());
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Evidence unavailable" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reload" })).toBeVisible();
});
