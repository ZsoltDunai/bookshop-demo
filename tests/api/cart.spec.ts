import { test, expect } from "@playwright/test";
import { authHeaders, login, registerUniqueUser } from "../helpers/api";

test.describe("Cart API", () => {
  test("add item to cart and retrieve cart", async ({ request }) => {
    const { token } = await registerUniqueUser(request);
    const books = await (await request.get("/api/books")).json();
    const book = books[0];

    const addResponse = await request.post("/api/cart/items", {
      headers: authHeaders(token),
      data: { book_id: book.id, quantity: 2 },
    });
    expect(addResponse.status()).toBe(201);
    const cartItem = await addResponse.json();
    expect(cartItem.quantity).toBe(2);
    expect(cartItem.book.id).toBe(book.id);

    const cartResponse = await request.get("/api/cart", {
      headers: authHeaders(token),
    });
    expect(cartResponse.ok()).toBeTruthy();
    const cart = await cartResponse.json();
    expect(cart.items).toHaveLength(1);
    expect(cart.total).toBeCloseTo(book.price * 2, 2);
  });

  test("update and remove cart item", async ({ request }) => {
    const { token } = await registerUniqueUser(request);
    const books = await (await request.get("/api/books")).json();
    const book = books[1];

    const addResponse = await request.post("/api/cart/items", {
      headers: authHeaders(token),
      data: { book_id: book.id, quantity: 1 },
    });
    const item = await addResponse.json();

    const updateResponse = await request.patch(`/api/cart/items/${item.id}`, {
      headers: authHeaders(token),
      data: { quantity: 3 },
    });
    expect(updateResponse.ok()).toBeTruthy();
    const updated = await updateResponse.json();
    expect(updated.quantity).toBe(3);

    const deleteResponse = await request.delete(`/api/cart/items/${item.id}`, {
      headers: authHeaders(token),
    });
    expect(deleteResponse.status()).toBe(204);

    const cart = await (await request.get("/api/cart", { headers: authHeaders(token) })).json();
    expect(cart.items).toHaveLength(0);
  });

  test("cart requires authentication", async ({ request }) => {
    const response = await request.get("/api/cart");
    expect(response.status()).toBe(403);
  });
});
