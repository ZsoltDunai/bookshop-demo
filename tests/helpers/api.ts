import { APIRequestContext } from "@playwright/test";
import { AuthApi } from "./clients/auth.api";
import { AuthedUser } from "./types";

export { DEMO_USER, DEFAULT_PASSWORD } from "./constants";

export async function registerUniqueUser(request: APIRequestContext): Promise<AuthedUser> {
  return new AuthApi(request).registerUniqueUser();
}

export { authHeaders } from "./auth-headers";
export type { AuthedUser, Book, Cart, CartItem, Order, OrderItem, User } from "./types";
