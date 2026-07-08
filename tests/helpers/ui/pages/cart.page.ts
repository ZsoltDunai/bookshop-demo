import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/cart");
    await expect(this.page.getByTestId("cart-heading")).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.page.getByTestId("cart-heading")).toBeVisible();
  }

  async expectReady(itemCount = 1) {
    await this.expectLoaded();
    if (itemCount === 0) {
      await expect(this.page.getByTestId("cart-empty")).toBeVisible();
      return;
    }

    await expect(this.page.getByTestId("cart-item")).toHaveCount(itemCount, { timeout: 15_000 });
    await expect(this.page.getByTestId("cart-total")).toContainText("Total: $", { timeout: 15_000 });
  }

  async expectItemCount(count: number) {
    await expect(this.page.getByTestId("cart-item")).toHaveCount(count);
  }

  async expectTotalVisible() {
    await expect(this.page.getByTestId("cart-total")).toContainText("Total: $");
  }

  async getTotalText(): Promise<string> {
    return (await this.page.getByTestId("cart-total").textContent()) ?? "";
  }

  async removeFirstItem() {
    await this.page.getByTestId("remove-item").click();
  }

  async expectEmpty() {
    await expect(this.page.getByTestId("cart-empty")).toBeVisible();
  }

  async checkout() {
    await this.page.getByTestId("checkout-btn").click();
  }
}
