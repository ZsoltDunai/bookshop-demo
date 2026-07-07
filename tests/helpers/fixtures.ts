import { test as base } from "@playwright/test";
import { registerUniqueUser } from "./api";
import { AuthApi } from "./clients/auth.api";
import { BooksApi } from "./clients/books.api";
import { CartApi } from "./clients/cart.api";
import { HealthApi } from "./clients/health.api";
import { OrdersApi } from "./clients/orders.api";
import { AuthedUser } from "./types";

type ApiFixtures = {
  authedUser: AuthedUser;
  authApi: AuthApi;
  booksApi: BooksApi;
  cartApi: CartApi;
  ordersApi: OrdersApi;
  healthApi: HealthApi;
};

export const test = base.extend<ApiFixtures>({
  authedUser: async ({ request }, use) => {
    const user = await registerUniqueUser(request);
    await use(user);
  },

  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  booksApi: async ({ request }, use) => {
    await use(new BooksApi(request));
  },

  cartApi: async ({ request, authedUser }, use) => {
    await use(new CartApi(request, authedUser.token));
  },

  ordersApi: async ({ request, authedUser }, use) => {
    await use(new OrdersApi(request, authedUser.token));
  },

  healthApi: async ({ request }, use) => {
    await use(new HealthApi(request));
  },
});

export { expect } from "@playwright/test";
