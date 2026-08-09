import type { Page, Route } from "@playwright/test";

const ANALYTICS_URL =
  /(?:google-analytics\.com|googletagmanager\.com|\/g\/collect|\/j\/collect)/i;

export type AnalyticsMock = {
  hits: string[];
  drainGtagCalls: () => Promise<unknown[][]>;
};

export async function mockAnalytics(page: Page): Promise<AnalyticsMock> {
  const hits: string[] = [];

  await page.route(ANALYTICS_URL, async (route: Route) => {
    hits.push(route.request().url());
    await route.fulfill({ status: 204, body: "" });
  });

  await page.addInitScript(() => {
    const w = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
      __pwGtagCalls?: unknown[][];
    };
    w.dataLayer = w.dataLayer ?? [];
    w.__pwGtagCalls = [];
    w.gtag = (...args: unknown[]) => {
      w.__pwGtagCalls?.push(args);
      w.dataLayer?.push(args);
      const en = typeof args[0] === "string" ? args[0] : "event";
      void fetch(
        `https://www.google-analytics.com/g/collect?v=2&tid=G-TEST&en=${encodeURIComponent(en)}`,
        { mode: "no-cors" },
      );
    };
  });

  return {
    hits,
    drainGtagCalls: () =>
      page.evaluate(() => {
        const w = window as Window & { __pwGtagCalls?: unknown[][] };
        const pending = w.__pwGtagCalls ?? [];
        w.__pwGtagCalls = [];
        return pending;
      }),
  };
}
