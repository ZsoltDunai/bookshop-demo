import { test, expect } from "@helpers/fixtures";
import { assertContract, assertJsonContract } from "@helpers/contract";
import {
  cartContractSchema,
  cartItemContractSchema,
  errorContractSchema,
  validationErrorSchema,
} from "@helpers/contract/schemas";

test.describe("Cart API contract", () => {
  let bookId: number;

  test.beforeEach(async ({ booksApi }) => {
    bookId = (await booksApi.first()).id;
  });

  test("POST /api/cart/items returns CartItem contract", async ({ request, authedUser }) => {
    const item = await assertContract(request, {
      name: "POST /api/cart/items",
      method: "POST",
      path: "/api/cart/items",
      status: 201,
      responseSchema: cartItemContractSchema,
      contentType: "application/json",
      auth: true,
      requestBody: { book_id: bookId, quantity: 1 },
    }, { token: authedUser.token });

    expect(item.book_id).toBe(bookId);
    cartItemContractSchema.parse(item);
  });

  test("GET /api/cart returns Cart contract", async ({ request, authedUser, cartApi }) => {
    await cartApi.addItem(bookId, 2);

    const cart = await assertContract(request, {
      name: "GET /api/cart",
      method: "GET",
      path: "/api/cart",
      status: 200,
      responseSchema: cartContractSchema,
      contentType: "application/json",
      auth: true,
    }, { token: authedUser.token });

    expect(cart.items).toHaveLength(1);
    expect(cart.total).toBeGreaterThan(0);
  });

  test("PATCH /api/cart/items/{id} returns CartItem contract", async ({ request, authedUser, cartApi }) => {
    const created = await cartApi.addItem(bookId, 1);

    const updated = await assertContract(request, {
      name: "PATCH /api/cart/items/{id}",
      method: "PATCH",
      path: (ctx) => `/api/cart/items/${ctx.cartItemId}`,
      status: 200,
      responseSchema: cartItemContractSchema,
      contentType: "application/json",
      auth: true,
      requestBody: { quantity: 3 },
    }, { token: authedUser.token, cartItemId: created.id });

    expect(updated.quantity).toBe(3);
  });

  test("DELETE /api/cart/items/{id} returns 204", async ({ request, authedUser, cartApi }) => {
    const created = await cartApi.addItem(bookId, 1);

    const response = await request.delete(`/api/cart/items/${created.id}`, {
      headers: { Authorization: `Bearer ${authedUser.token}` },
    });
    expect(response.status()).toBe(204);
  });

  test("POST /api/cart/items with invalid payload returns validation error contract", async ({
    request,
    authedUser,
  }) => {
    const response = await request.post("/api/cart/items", {
      headers: { Authorization: `Bearer ${authedUser.token}` },
      data: { book_id: "invalid", quantity: 0 },
    });
    await assertJsonContract(response, 422, validationErrorSchema, "POST /api/cart/items 422");
  });

  test("GET /api/cart without auth returns 403", async ({ request }) => {
    const response = await request.get("/api/cart");
    expect(response.status()).toBe(403);
  });

  test("POST /api/cart/items for unknown book returns error contract", async ({ request, authedUser }) => {
    const response = await request.post("/api/cart/items", {
      headers: { Authorization: `Bearer ${authedUser.token}` },
      data: { book_id: 999999, quantity: 1 },
    });
    await assertJsonContract(response, 404, errorContractSchema, "POST /api/cart/items 404");
  });
});
