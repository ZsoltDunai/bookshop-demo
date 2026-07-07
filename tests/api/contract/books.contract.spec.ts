import { test, expect } from "@helpers/fixtures";
import { assertContract, assertJsonContract } from "@helpers/contract";
import {
  bookContractSchema,
  booksContractSchema,
  errorContractSchema,
} from "@helpers/contract/schemas";

test.describe("Books API contract", () => {
  test("GET /api/books returns Book[] contract", async ({ request }) => {
    const books = await assertContract(request, {
      name: "GET /api/books",
      method: "GET",
      path: "/api/books",
      status: 200,
      responseSchema: booksContractSchema,
      contentType: "application/json",
    });

    expect(books.length).toBeGreaterThanOrEqual(1);
    books.forEach((book) => bookContractSchema.parse(book));
  });

  test("GET /api/books/{id} returns Book contract", async ({ request, booksApi }) => {
    const book = await booksApi.first();

    const result = await assertContract(request, {
      name: "GET /api/books/{id}",
      method: "GET",
      path: (ctx) => `/api/books/${ctx.bookId}`,
      status: 200,
      responseSchema: bookContractSchema,
      contentType: "application/json",
    }, { bookId: book.id });

    expect(result.id).toBe(book.id);
  });

  test("GET /api/books/{id} 404 returns error contract", async ({ request }) => {
    const response = await request.get("/api/books/999999");
    const body = await assertJsonContract(response, 404, errorContractSchema, "GET /api/books/{id} 404");
    expect(body.detail).toBeTruthy();
  });

  test("GET /api/books/{id} invalid id returns validation error contract", async ({ request }) => {
    const response = await request.get("/api/books/not-a-number");
    await assertJsonContract(response, 422, errorContractSchema, "GET /api/books/{id} 422");
  });
});
