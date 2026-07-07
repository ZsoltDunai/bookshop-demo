import { expect } from "@playwright/test";
import { API_TIMEOUTS } from "./constants";

export async function measureResponseTime(
  action: () => Promise<{ ok: () => boolean }>,
): Promise<{ durationMs: number }> {
  const start = Date.now();
  const response = await action();
  expect(response.ok()).toBeTruthy();
  return { durationMs: Date.now() - start };
}

export function expectWithinMs(durationMs: number, maxMs: number) {
  expect(durationMs, `Expected response within ${maxMs}ms, got ${durationMs}ms`).toBeLessThan(maxMs);
}

export { API_TIMEOUTS };
