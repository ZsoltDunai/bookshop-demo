import { test, expect } from "@playwright/test";
import { authHeaders, registerUniqueUser } from "../helpers/api";

test.describe("Checkout API", () => {
  test("checkout creates order and clears cart", async ({ request }) => {
    const { token } = await registerUniqueUser(request);
    const books = await (await request.get("/api/books")).json();
    const book = books[2];

    await request.post("/api/cart/items", {
      headers: authHeaders(token),
      data: { book_id: book.id, quantity: 1 },
    });

    const checkoutResponse = await request.post("/api/orders/checkout", {
      headers: authHeaders(token),
    });
    expect(checkoutResponse.status()).toBe(201);
    const order = await checkoutResponse.json();
    expect(order.status).toBe("confirmed");
    expect(order.total).toBeCloseTo(book.price, 2);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].book.title).toBe(book.title);

    const cart = await (await request.get("/api/cart", { headers: authHeaders(token) })).json();
    expect(cart.items).toHaveLength(0);

    const orders = await (await request.get("/api/orders", { headers: authHeaders(token) })).json();
    expect(orders.some((o: { id: number }) => o.id === order.id)).toBeTruthy();
  });

  test("checkout with empty cart returns 400", async ({ request }) => {
    const { token } = await registerUniqueUser(request);
    const response = await request.post("/api/orders/checkout", {
      headers: authHeaders(token),
    });
    expect(response.status()).toBe(400);
  });
});
