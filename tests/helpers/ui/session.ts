import { APIRequestContext, Page } from "@playwright/test";
import { AuthApi } from "../clients/auth.api";
import { BooksApi } from "../clients/books.api";
import { CartApi } from "../clients/cart.api";

const TOKEN_KEY = "bookshop_token";

export async function seedDemoUserCart(page: Page, request: APIRequestContext): Promise<void> {
  const { access_token } = await new AuthApi(request).loginOrThrow();
  const books = await new BooksApi(request).list();
  const cartApi = new CartApi(request, access_token);

  try {
    await cartApi.clear();
  } catch {
    // Cart may already be empty between tests.
  }

  await cartApi.addItem(books[0].id);

  await page.goto("/");
  await page.evaluate(
    ([key, token]) => localStorage.setItem(key, token),
    [TOKEN_KEY, access_token] as const,
  );
}
