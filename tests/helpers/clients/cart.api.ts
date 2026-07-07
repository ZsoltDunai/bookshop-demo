import { APIRequestContext } from "@playwright/test";
import { authHeaders } from "../auth-headers";
import { ApiResponse } from "../response";
import { cartItemSchema, cartSchema } from "../schemas";
import { Cart, CartItem } from "../types";

export class CartApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string,
  ) {}

  async get(): Promise<Cart> {
    const response = await this.request.get("/api/cart", {
      headers: authHeaders(this.token),
    });
    return ApiResponse.expectOkValidated(response, cartSchema);
  }

  async isEmpty(): Promise<boolean> {
    const cart = await this.get();
    return cart.items.length === 0;
  }

  async addItem(bookId: number, quantity = 1): Promise<CartItem> {
    const response = await this.request.post("/api/cart/items", {
      headers: authHeaders(this.token),
      data: { book_id: bookId, quantity },
    });
    return ApiResponse.expectJsonValidated(response, 201, cartItemSchema);
  }

  async updateItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await this.request.patch(`/api/cart/items/${itemId}`, {
      headers: authHeaders(this.token),
      data: { quantity },
    });
    return ApiResponse.expectOkValidated(response, cartItemSchema);
  }

  async removeItem(itemId: number): Promise<void> {
    const response = await this.request.delete(`/api/cart/items/${itemId}`, {
      headers: authHeaders(this.token),
    });
    await ApiResponse.expectNoContent(response);
  }

  async removeItemRaw(itemId: number): Promise<ApiResponse<null>> {
    const response = await this.request.delete(`/api/cart/items/${itemId}`, {
      headers: authHeaders(this.token),
    });
    return ApiResponse.parse(response);
  }

  async clear(): Promise<void> {
    const response = await this.request.delete("/api/cart", {
      headers: authHeaders(this.token),
    });
    await ApiResponse.expectNoContent(response);
  }

  async getUnauthenticated(): Promise<ApiResponse<Cart>> {
    const response = await this.request.get("/api/cart");
    return ApiResponse.parse<Cart>(response);
  }
}
