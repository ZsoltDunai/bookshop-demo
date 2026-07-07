import { APIResponse, expect } from "@playwright/test";
import { z } from "zod";

export class ApiResponse<T = unknown> {
  constructor(
    readonly raw: APIResponse,
    readonly body: T,
    readonly status: number,
  ) {}

  get ok(): boolean {
    return this.raw.ok();
  }

  get headers(): { [key: string]: string } {
    return this.raw.headers();
  }

  static async parse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    const status = response.status();
    const body = status === 204 ? (null as T) : await response.json();
    return new ApiResponse(response, body, status);
  }

  static async expectStatus(response: APIResponse, status: number): Promise<APIResponse> {
    expect(response.status(), `Expected HTTP ${status}`).toBe(status);
    return response;
  }

  static async expectJson<T>(response: APIResponse, status: number): Promise<T> {
    await ApiResponse.expectStatus(response, status);
    return response.json();
  }

  static async expectOk<T>(response: APIResponse): Promise<T> {
    expect(response.ok(), `Expected 2xx, got ${response.status()}`).toBeTruthy();
    return response.json();
  }

  static async expectOkValidated<T>(response: APIResponse, schema: z.ZodType<T>): Promise<T> {
    const body = await ApiResponse.expectOk<unknown>(response);
    return schema.parse(body);
  }

  static async expectJsonValidated<T>(
    response: APIResponse,
    status: number,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const body = await ApiResponse.expectJson<unknown>(response, status);
    return schema.parse(body);
  }

  static async expectNoContent(response: APIResponse): Promise<void> {
    await ApiResponse.expectStatus(response, 204);
  }
}
