import { test, expect } from "@playwright/test";

test.describe("Checkout UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("demo@bookshop.io");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();
    await page.goto("/shop");
    await page.getByTestId("add-to-cart").first().click();
    await page.getByTestId("nav-cart").click();
  });

  test("cart shows item and total", async ({ page }) => {
    await expect(page.getByTestId("cart-heading")).toBeVisible();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
    await expect(page.getByTestId("cart-total")).toContainText("Total: $");
  });

  test("remove item empties cart", async ({ page }) => {
    await page.getByTestId("remove-item").click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("checkout completes and shows order", async ({ page }) => {
    const totalText = await page.getByTestId("cart-total").textContent();
    await page.getByTestId("checkout-btn").click();

    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByTestId("order-success")).toBeVisible();
    await expect(page.getByTestId("order-card").first()).toBeVisible();
    await expect(page.getByTestId("order-total").first()).toContainText(
      totalText?.replace("Total: ", "") ?? "",
    );
  });
});
