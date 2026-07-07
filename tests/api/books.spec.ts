import { test, expect } from "@playwright/test";

test.describe("Books API", () => {
  test("lists seeded books", async ({ request }) => {
    const response = await request.get("/api/books");
    expect(response.ok()).toBeTruthy();
    const books = await response.json();
    expect(books.length).toBeGreaterThanOrEqual(6);
    expect(books[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      author: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });

  test("get book by id", async ({ request }) => {
    const list = await request.get("/api/books");
    const books = await list.json();
    const bookId = books[0].id;

    const response = await request.get(`/api/books/${bookId}`);
    expect(response.ok()).toBeTruthy();
    const book = await response.json();
    expect(book.id).toBe(bookId);
  });

  test("returns 404 for unknown book", async ({ request }) => {
    const response = await request.get("/api/books/99999");
    expect(response.status()).toBe(404);
  });
});
