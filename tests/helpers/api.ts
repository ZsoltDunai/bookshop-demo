import { APIRequestContext, expect } from "@playwright/test";

export const DEMO_USER = {
  email: "demo@bookshop.io",
  password: "password123",
};

export async function login(
  request: APIRequestContext,
  email = DEMO_USER.email,
  password = DEMO_USER.password,
): Promise<string> {
  const response = await request.post("/api/auth/login", {
    data: { email, password },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.access_token as string;
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function registerUniqueUser(request: APIRequestContext) {
  const email = `user-${Date.now()}@bookshop.io`;
  const password = "password123";
  const response = await request.post("/api/auth/register", {
    data: { email, password },
  });
  expect(response.status()).toBe(201);
  const token = await login(request, email, password);
  return { email, password, token };
}
