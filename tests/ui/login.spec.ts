import { test, expect } from "@helpers/ui/fixtures";

test.describe("Login UI", () => {
  test("home page links to login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cta-login")).toBeVisible();
    await page.getByTestId("cta-login").click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId("login-heading")).toBeVisible();
  });

  test("successful login redirects to shop", async ({ page, loginPage, shopPage }) => {
    await loginPage.login();
    await expect(page).toHaveURL(/\/shop/);
    await shopPage.expectLoaded();
  });

  test("invalid login shows error", async ({ loginPage }) => {
    await loginPage.login("demo@bookshop.io", "wrong");
    await loginPage.expectLoginError();
  });
});
