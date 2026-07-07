import { test } from "@helpers/ui/fixtures";

test.describe("Checkout UI", () => {
  test("cart shows item and total", async ({ cartWithItem }) => {
    await cartWithItem.expectItemCount(1);
    await cartWithItem.expectTotalVisible();
  });

  test("remove item empties cart", async ({ cartWithItem }) => {
    await cartWithItem.removeFirstItem();
    await cartWithItem.expectEmpty();
  });

  test("checkout completes and shows order", async ({ cartWithItem, ordersPage }) => {
    const totalText = await cartWithItem.getTotalText();
    await cartWithItem.checkout();

    await ordersPage.expectLoaded();
    await ordersPage.expectCheckoutSuccess();
    await ordersPage.expectOrderTotalContains(totalText.replace("Total: ", ""));
  });
});
