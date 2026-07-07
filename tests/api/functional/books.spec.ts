import { test, expect } from "@helpers/fixtures";
import { Book } from "@helpers/types";

test.describe("Books API", () => {
  let books: Book[];

  test.beforeEach(async ({ booksApi }) => {
    books = await booksApi.list();
  });

  test("lists seeded books", async () => {
    expect(books.length).toBeGreaterThanOrEqual(6);
    expect(books[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      author: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });

  test("get book by id", async ({ booksApi }) => {
    const bookId = books[0].id;
    const result = await booksApi.getById(bookId);

    expect(result.ok).toBeTruthy();
    expect(result.body.id).toBe(bookId);
  });

  test("returns 404 for unknown book", async ({ booksApi }) => {
    const result = await booksApi.getById(99999);
    expect(result.status).toBe(404);
  });
});
