import { test, expect } from "@helpers/fixtures";
import { DEMO_USER } from "@helpers/constants";

test.describe("Auth API", () => {
  test("login with valid credentials returns token", async ({ authApi }) => {
    const result = await authApi.login();

    expect(result.ok).toBeTruthy();
    expect(result.body).toHaveProperty("access_token");
    expect(result.body.token_type).toBe("bearer");
  });

  test("login with invalid credentials returns 401", async ({ authApi }) => {
    const result = await authApi.login(DEMO_USER.email, "wrongpassword");
    expect(result.status).toBe(401);
  });

  test("register new user and access /me", async ({ authApi }) => {
    const user = await authApi.registerUniqueUser();
    const me = await authApi.me(user.token);

    expect(me.ok).toBeTruthy();
    expect(me.body.email).toBe(user.email);
  });

  test("protected endpoint rejects missing token", async ({ request }) => {
    const response = await request.get("/api/auth/me");
    expect(response.status()).toBe(403);
  });
});
