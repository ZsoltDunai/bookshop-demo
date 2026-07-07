import { test, expect } from "@playwright/test";
import { DEMO_USER, login, registerUniqueUser } from "../helpers/api";

test.describe("Auth API", () => {
  test("login with valid credentials returns token", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: DEMO_USER,
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty("access_token");
    expect(body.token_type).toBe("bearer");
  });

  test("login with invalid credentials returns 401", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: DEMO_USER.email, password: "wrongpassword" },
    });
    expect(response.status()).toBe(401);
  });

  test("register new user and access /me", async ({ request }) => {
    const { email, token } = await registerUniqueUser(request);
    const response = await request.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.email).toBe(email);
  });

  test("protected endpoint rejects missing token", async ({ request }) => {
    const response = await request.get("/api/auth/me");
    expect(response.status()).toBe(403);
  });
});
