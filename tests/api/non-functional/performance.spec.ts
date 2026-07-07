import { test, expect } from "@helpers/fixtures";
import { DEMO_USER } from "@helpers/constants";
import { API_TIMEOUTS, expectWithinMs } from "@helpers/timing";

test.describe("API performance", () => {
  test("health endpoint responds within 500ms", async ({ healthApi }) => {
    const start = Date.now();
    const result = await healthApi.check();

    expect(result.ok).toBeTruthy();
    expectWithinMs(Date.now() - start, API_TIMEOUTS.health);
  });

  test("books list responds within 1000ms", async ({ booksApi }) => {
    const start = Date.now();
    await booksApi.list();
    expectWithinMs(Date.now() - start, API_TIMEOUTS.booksList);
  });

  test("login responds within 1500ms", async ({ authApi }) => {
    const start = Date.now();
    const result = await authApi.login(DEMO_USER.email, DEMO_USER.password);

    expect(result.ok).toBeTruthy();
    expectWithinMs(Date.now() - start, API_TIMEOUTS.login);
  });

  test("handles concurrent book list requests", async ({ request }) => {
    const requests = Array.from({ length: 10 }, () => request.get("/api/books"));
    const start = Date.now();
    const responses = await Promise.all(requests);

    for (const response of responses) {
      expect(response.ok()).toBeTruthy();
    }
    expectWithinMs(Date.now() - start, API_TIMEOUTS.concurrentBooks);
  });
});
