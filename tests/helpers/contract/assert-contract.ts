import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface ContractContext {
  token?: string;
  bookId?: number;
  cartItemId?: number;
  orderId?: number;
}

export interface EndpointContract<T extends z.ZodType = z.ZodType> {
  name: string;
  method: HttpMethod;
  path: string | ((ctx: ContractContext) => string);
  status: number;
  responseSchema?: T;
  requestBody?: unknown | ((ctx: ContractContext) => unknown);
  auth?: boolean;
  contentType?: string;
}

async function dispatchRequest(
  request: APIRequestContext,
  method: HttpMethod,
  path: string,
  headers: Record<string, string>,
  body?: unknown,
): Promise<APIResponse> {
  const options = { headers, data: body };

  switch (method) {
    case "GET":
      return request.get(path, { headers });
    case "POST":
      return request.post(path, options);
    case "PATCH":
      return request.patch(path, options);
    case "DELETE":
      return request.delete(path, { headers });
  }
}

export async function assertContract<T extends z.ZodType>(
  request: APIRequestContext,
  contract: EndpointContract<T>,
  ctx: ContractContext = {},
): Promise<z.infer<T>> {
  const path = typeof contract.path === "function" ? contract.path(ctx) : contract.path;
  const body =
    typeof contract.requestBody === "function" ? contract.requestBody(ctx) : contract.requestBody;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (contract.auth && ctx.token) {
    headers.Authorization = `Bearer ${ctx.token}`;
  }

  const response = await dispatchRequest(request, contract.method, path, headers, body);

  await assertStatus(response, contract.status, contract.name);

  if (contract.contentType) {
    expect(response.headers()["content-type"], `${contract.name} content-type`).toContain(
      contract.contentType,
    );
  }

  if (contract.status === 204) {
    return undefined as z.infer<T>;
  }

  const json = await response.json();

  if (contract.responseSchema) {
    return contract.responseSchema.parse(json);
  }

  return json as z.infer<T>;
}

export async function assertStatus(response: APIResponse, status: number, label: string) {
  expect(response.status(), `${label} status`).toBe(status);
}

export async function assertJsonContract<T extends z.ZodType>(
  response: APIResponse,
  status: number,
  schema: T,
  label: string,
): Promise<z.infer<T>> {
  await assertStatus(response, status, label);
  const json = await response.json();
  return schema.parse(json);
}
