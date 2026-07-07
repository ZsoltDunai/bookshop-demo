import { Page, expect } from "@playwright/test";

export class OrdersPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/orders/);
    await expect(this.page.getByTestId("orders-heading")).toBeVisible();
  }

  async expectCheckoutSuccess() {
    await expect(this.page.getByTestId("order-success")).toBeVisible();
    await expect(this.page.getByTestId("order-card").first()).toBeVisible();
  }

  async expectOrderTotalContains(amount: string) {
    await expect(this.page.getByTestId("order-total").first()).toContainText(amount);
  }
}
