import { APIRequestContext } from "@playwright/test";
import { ApiResponse } from "../response";
import { healthSchema } from "../schemas";

export class HealthApi {
  constructor(private readonly request: APIRequestContext) {}

  async check(): Promise<ApiResponse<{ status: string }>> {
    const response = await this.request.get("/health");
    return ApiResponse.parse<{ status: string }>(response);
  }

  async checkOrThrow(): Promise<{ status: string }> {
    const response = await this.request.get("/health");
    return ApiResponse.expectOkValidated(response, healthSchema);
  }
}
