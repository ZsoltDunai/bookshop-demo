import { test, expect } from "@helpers/fixtures";
import { UNAUTHENTICATED_HTTP_STATUS } from "@helpers/constants";
import { AuthApi } from "@helpers/clients/auth.api";
import { CartApi } from "@helpers/clients/cart.api";

test.describe("API security", () => {
  test("rejects invalid bearer token", async ({ authApi }) => {
    const result = await authApi.me("invalid-token");
    expect(result.status).toBe(401);
  });

  test("rejects malformed authorization header", async ({ request }) => {
    const response = await request.get("/api/cart", {
      headers: { Authorization: "NotBearer token" },
    });
    expect(response.status()).toBe(UNAUTHENTICATED_HTTP_STATUS);
  });

  test("rejects registration with short password", async ({ authApi }) => {
    const result = await authApi.register(`short-pw-${Date.now()}@bookshop.io`, "123");
    expect(result.status).toBe(422);
  });

  test("rejects registration with invalid email", async ({ authApi }) => {
    const result = await authApi.register("not-an-email", "password123");
    expect(result.status).toBe(422);
  });

  test.describe("cart isolation", () => {
    let itemId: number;

    test.beforeEach(async ({ booksApi, cartApi }) => {
      const book = await booksApi.first();
      const item = await cartApi.addItem(book.id, 1);
      itemId = item.id;
    });

    test("users cannot access another users cart items", async ({ request, authedUser }) => {
      const otherUser = await new AuthApi(request).registerUniqueUser();
      const otherCart = new CartApi(request, otherUser.token);

      const result = await otherCart.removeItemRaw(itemId);
      expect(result.status).toBe(404);

      const ownerCart = new CartApi(request, authedUser.token);
      const cart = await ownerCart.get();
      expect(cart.items).toHaveLength(1);
    });
  });

  test("protected endpoints reject unauthenticated access", async ({ cartApi, ordersApi }) => {
    const results = await Promise.all([
      cartApi.getUnauthenticated(),
      ordersApi.listUnauthenticated(),
      ordersApi.checkoutUnauthenticated(),
    ]);

    for (const result of results) {
      expect(result.status).toBe(UNAUTHENTICATED_HTTP_STATUS);
    }
  });
});
