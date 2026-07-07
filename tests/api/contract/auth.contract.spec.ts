import { test, expect } from "@helpers/fixtures";
import { assertContract, assertJsonContract } from "@helpers/contract";
import {
  tokenContractSchema,
  unauthorizedErrorSchema,
  userContractSchema,
  validationErrorSchema,
} from "@helpers/contract/schemas";
import { DEFAULT_PASSWORD } from "@helpers/constants";

test.describe("Auth API contract", () => {
  test("POST /api/auth/login returns Token contract", async ({ request, authApi }) => {
    const result = await authApi.login();
    expect(result.status).toBe(200);
    tokenContractSchema.parse(result.body);
  });

  test("POST /api/auth/register returns User contract", async ({ request }) => {
    const email = `contract-${Date.now()}@bookshop.io`;
    const body = await assertContract(request, {
      name: "POST /api/auth/register",
      method: "POST",
      path: "/api/auth/register",
      status: 201,
      responseSchema: userContractSchema,
      contentType: "application/json",
      requestBody: { email, password: DEFAULT_PASSWORD },
    });

    expect(body.email).toBe(email);
  });

  test("GET /api/auth/me returns User contract", async ({ request, authedUser }) => {
    const body = await assertContract(request, {
      name: "GET /api/auth/me",
      method: "GET",
      path: "/api/auth/me",
      status: 200,
      responseSchema: userContractSchema,
      contentType: "application/json",
      auth: true,
    }, { token: authedUser.token });

    expect(body.email).toBe(authedUser.email);
  });

  test("POST /api/auth/login error returns unauthorized contract", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "demo@bookshop.io", password: "wrong" },
    });
    await assertJsonContract(response, 401, unauthorizedErrorSchema, "POST /api/auth/login 401");
  });

  test("POST /api/auth/register validation error contract", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: { email: "bad-email", password: "123" },
    });
    await assertJsonContract(response, 422, validationErrorSchema, "POST /api/auth/register 422");
  });

  test("GET /api/auth/me without token returns 403", async ({ request }) => {
    const response = await request.get("/api/auth/me");
    expect(response.status()).toBe(403);
  });
});
