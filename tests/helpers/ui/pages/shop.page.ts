import { Page, expect } from "@playwright/test";

export class ShopPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/shop");
  }

  async expectLoaded() {
    await expect(this.page.getByTestId("shop-heading")).toBeVisible();
    await expect(this.page.getByTestId("book-grid")).toBeVisible();
    await this.expectCatalogLoaded();
  }

  async expectCatalogLoaded() {
    await expect(this.page.getByTestId("book-card").first()).toBeVisible();
    await expect(
      this.page.getByTestId("add-to-cart").and(this.page.locator(":enabled")).first()
    ).toBeVisible();
  }

  async addFirstBookToCart() {
    await this.expectCatalogLoaded();
    const addToCartResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/cart/items") &&
        response.request().method() === "POST" &&
        response.ok()
    );
    await this.page.getByTestId("add-to-cart").and(this.page.locator(":enabled")).first().click();
    await addToCartResponse;
    await this.expectAddToCartSuccess();
  }

  async goToCart() {
    const cartResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/cart") &&
        response.request().method() === "GET" &&
        response.ok()
    );
    await this.page.getByTestId("nav-cart").click();
    await cartResponse;
  }

  async expectAddToCartSuccess() {
    await expect(this.page.getByTestId("shop-alert")).toBeVisible();
    await expect(this.page.getByTestId("shop-alert")).toHaveText("Added to cart!");
  }
}
