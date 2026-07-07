import { APIRequestContext } from "@playwright/test";
import { DEMO_USER } from "../constants";
import { authHeaders } from "../auth-headers";
import { ApiResponse } from "../response";
import { tokenSchema, userSchema } from "../schemas";
import { AuthedUser, TokenResponse, User } from "../types";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(email = DEMO_USER.email, password = DEMO_USER.password): Promise<ApiResponse<TokenResponse>> {
    const response = await this.request.post("/api/auth/login", {
      data: { email, password },
    });
    return ApiResponse.parse<TokenResponse>(response);
  }

  async loginOrThrow(email = DEMO_USER.email, password = DEMO_USER.password): Promise<TokenResponse> {
    const response = await this.request.post("/api/auth/login", {
      data: { email, password },
    });
    return ApiResponse.expectOkValidated(response, tokenSchema);
  }

  async register(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.request.post("/api/auth/register", {
      data: { email, password },
    });
    return ApiResponse.parse<User>(response);
  }

  async registerOrThrow(email: string, password: string): Promise<User> {
    const response = await this.request.post("/api/auth/register", {
      data: { email, password },
    });
    return ApiResponse.expectJsonValidated(response, 201, userSchema);
  }

  async me(token: string): Promise<ApiResponse<User>> {
    const response = await this.request.get("/api/auth/me", {
      headers: authHeaders(token),
    });
    return ApiResponse.parse<User>(response);
  }

  async registerUniqueUser(password = "password123"): Promise<AuthedUser> {
    const email = `user-${Date.now()}@bookshop.io`;
    await this.registerOrThrow(email, password);
    const { access_token } = await this.loginOrThrow(email, password);
    return { email, password, token: access_token };
  }
}
