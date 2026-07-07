import { APIRequestContext } from "@playwright/test";
import { authHeaders } from "../auth-headers";
import { ApiResponse } from "../response";
import { orderSchema, ordersSchema } from "../schemas";
import { Order } from "../types";

export class OrdersApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string,
  ) {}

  async checkout(): Promise<Order> {
    const response = await this.request.post("/api/orders/checkout", {
      headers: authHeaders(this.token),
    });
    return ApiResponse.expectJsonValidated(response, 201, orderSchema);
  }

  async checkoutRaw(): Promise<ApiResponse<Order>> {
    const response = await this.request.post("/api/orders/checkout", {
      headers: authHeaders(this.token),
    });
    return ApiResponse.parse<Order>(response);
  }

  async checkoutUnauthenticated(): Promise<ApiResponse<Order>> {
    const response = await this.request.post("/api/orders/checkout");
    return ApiResponse.parse<Order>(response);
  }

  async list(): Promise<Order[]> {
    const response = await this.request.get("/api/orders", {
      headers: authHeaders(this.token),
    });
    return ApiResponse.expectOkValidated(response, ordersSchema);
  }

  async listUnauthenticated(): Promise<ApiResponse<Order[]>> {
    const response = await this.request.get("/api/orders");
    return ApiResponse.parse<Order[]>(response);
  }
}
