import { test, expect } from "@helpers/ui/fixtures";

test.describe("Shop UI", () => {
  test.beforeEach(async ({ loggedInShop }) => {
    await loggedInShop.expectLoaded();
  });

  test("displays book catalog", async ({ page }) => {
    const cards = page.getByTestId("book-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(6);
    await expect(page.getByTestId("book-title").first()).not.toBeEmpty();
    await expect(page.getByTestId("book-price").first()).toContainText("$");
  });

  test("add book to cart shows success message", async ({ loggedInShop }) => {
    await loggedInShop.addFirstBookToCart();
    await loggedInShop.expectAddToCartSuccess();
  });

  test("navigate to cart from shop", async ({ loggedInShop, cartPage }) => {
    await loggedInShop.addFirstBookToCart();
    await loggedInShop.goToCart();
    await cartPage.expectItemCount(1);
  });
});
