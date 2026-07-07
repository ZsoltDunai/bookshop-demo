import { test, expect } from "@helpers/fixtures";
import { UNAUTHENTICATED_HTTP_STATUS } from "@helpers/constants";
import { Book, CartItem } from "@helpers/types";

test.describe("Cart API", () => {
  let book: Book;

  test.beforeEach(async ({ booksApi }) => {
    book = await booksApi.first();
  });

  test("add item to cart and retrieve cart", async ({ cartApi }) => {
    const cartItem = await cartApi.addItem(book.id, 2);
    const cart = await cartApi.get();

    expect(cartItem.quantity).toBe(2);
    expect(cartItem.book.id).toBe(book.id);
    expect(cart.items).toHaveLength(1);
    expect(cart.total).toBeCloseTo(book.price * 2, 2);
  });

  test.describe("with item in cart", () => {
    let cartItem: CartItem;

    test.beforeEach(async ({ cartApi }) => {
      cartItem = await cartApi.addItem(book.id, 1);
    });

    test("update and remove cart item", async ({ cartApi }) => {
      const updated = await cartApi.updateItem(cartItem.id, 3);
      expect(updated.quantity).toBe(3);

      await cartApi.removeItem(cartItem.id);

      const cart = await cartApi.get();
      expect(cart.items).toHaveLength(0);
    });
  });

  test("cart requires authentication", async ({ request }) => {
    const response = await request.get("/api/cart");
    expect(response.status()).toBe(UNAUTHENTICATED_HTTP_STATUS);
  });
});
