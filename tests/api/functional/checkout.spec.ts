import { test, expect } from "@helpers/fixtures";
import { Book } from "@helpers/types";

test.describe("Checkout API", () => {
  let book: Book;

  test.beforeEach(async ({ booksApi }) => {
    const books = await booksApi.list();
    book = books[2];
  });

  test("checkout creates order and clears cart", async ({ cartApi, ordersApi }) => {
    await cartApi.addItem(book.id, 1);

    const order = await ordersApi.checkout();
    const cart = await cartApi.get();
    const orders = await ordersApi.list();

    expect(order.status).toBe("confirmed");
    expect(order.total).toBeCloseTo(book.price, 2);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].book.title).toBe(book.title);
    expect(cart.items).toHaveLength(0);
    expect(orders.some((o) => o.id === order.id)).toBeTruthy();
  });

  test("checkout with empty cart returns 400", async ({ ordersApi }) => {
    const result = await ordersApi.checkoutRaw();
    expect(result.status).toBe(400);
  });
});
