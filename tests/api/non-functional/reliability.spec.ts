import { test, expect } from "@helpers/fixtures";
import { ApiResponse } from "@helpers/response";

test.describe("API reliability", () => {
  test("health endpoint returns stable JSON", async ({ healthApi }) => {
    const result = await healthApi.check();

    expect(result.ok).toBeTruthy();
    expect(result.headers["content-type"]).toContain("application/json");
    expect(result.body).toEqual({ status: "ok" });
  });

  test("books endpoint returns JSON content type", async ({ request }) => {
    const response = await request.get("/api/books");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test("repeated health checks remain available", async ({ healthApi }) => {
    for (let i = 0; i < 5; i++) {
      const result = await healthApi.check();
      expect(result.ok).toBeTruthy();
      expect(result.body.status).toBe("ok");
    }
  });

  test("unknown routes return JSON error responses", async ({ request }) => {
    const response = await request.get("/api/does-not-exist");
    const result = await ApiResponse.parse(response);

    expect(result.status).toBe(404);
    expect(result.headers["content-type"]).toContain("application/json");
  });

  test("invalid book id returns structured error", async ({ booksApi }) => {
    const result = await booksApi.getByInvalidId("not-a-number");

    expect(result.status).toBe(422);
    expect(result.body).toHaveProperty("detail");
  });
});
