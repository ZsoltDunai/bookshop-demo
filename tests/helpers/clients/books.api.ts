import { APIRequestContext } from "@playwright/test";
import { ApiResponse } from "../response";
import { bookSchema, booksSchema } from "../schemas";
import { Book } from "../types";

export class BooksApi {
  constructor(private readonly request: APIRequestContext) {}

  async list(): Promise<Book[]> {
    const response = await this.request.get("/api/books");
    return ApiResponse.expectOkValidated(response, booksSchema);
  }

  async first(): Promise<Book> {
    const books = await this.list();
    return books[0];
  }

  async getById(id: number): Promise<ApiResponse<Book>> {
    const response = await this.request.get(`/api/books/${id}`);
    return ApiResponse.parse<Book>(response);
  }

  async getByIdOrThrow(id: number): Promise<Book> {
    const response = await this.request.get(`/api/books/${id}`);
    return ApiResponse.expectOkValidated(response, bookSchema);
  }

  async getByInvalidId(invalidId: string): Promise<ApiResponse<unknown>> {
    const response = await this.request.get(`/api/books/${invalidId}`);
    return ApiResponse.parse(response);
  }
}
