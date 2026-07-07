import { Page, expect } from "@playwright/test";

export class ShopPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/shop");
  }

  async expectLoaded() {
    await expect(this.page.getByTestId("shop-heading")).toBeVisible();
    await expect(this.page.getByTestId("book-grid")).toBeVisible();
  }

  async addFirstBookToCart() {
    await this.page.getByTestId("add-to-cart").first().click();
  }

  async expectAddToCartSuccess() {
    await expect(this.page.getByTestId("shop-alert")).toBeVisible();
    await expect(this.page.getByTestId("shop-alert")).toHaveText("Added to cart!");
  }

  async goToCart() {
    await this.page.getByTestId("nav-cart").click();
  }
}
