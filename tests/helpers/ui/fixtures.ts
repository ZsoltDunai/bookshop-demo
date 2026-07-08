import { test as base } from "@playwright/test";
import { LoginPage, ShopPage, CartPage, OrdersPage } from "./pages";
import { seedDemoUserCart } from "./session";

type UiFixtures = {
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  ordersPage: OrdersPage;
  loggedInShop: ShopPage;
  cartWithItem: CartPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  loggedInShop: async ({ page, loginPage, shopPage }, use) => {
    await loginPage.login();
    await shopPage.expectLoaded();
    await use(shopPage);
  },

  cartWithItem: async ({ page, request, cartPage }, use) => {
    await seedDemoUserCart(page, request);
    await cartPage.goto();
    await cartPage.expectReady(1);
    await use(cartPage);
  },
});

export { expect } from "@playwright/test";
