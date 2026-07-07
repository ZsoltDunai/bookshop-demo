import { test, expect } from "@helpers/fixtures";
import { assertContract, assertJsonContract } from "@helpers/contract";
import { UNAUTHENTICATED_HTTP_STATUS } from "@helpers/constants";
import {
  errorContractSchema,
  orderContractSchema,
  ordersContractSchema,
} from "@helpers/contract/schemas";

test.describe("Orders API contract", () => {
  test("POST /api/orders/checkout returns Order contract", async ({ cartApi, ordersApi, booksApi }) => {
    const book = await booksApi.first();
    await cartApi.addItem(book.id, 1);

    const order = await ordersApi.checkout();
    orderContractSchema.parse(order);

    expect(order.status).toBe("confirmed");
    expect(order.items[0].book.title).toBe(book.title);
  });

  test("GET /api/orders returns Order[] contract", async ({ request, authedUser, cartApi, booksApi }) => {
    const book = await booksApi.first();
    await cartApi.addItem(book.id, 1);

    const checkoutResponse = await request.post("/api/orders/checkout", {
      headers: { Authorization: `Bearer ${authedUser.token}` },
    });
    expect(checkoutResponse.status()).toBe(201);

    const orders = await assertContract(
      request,
      {
        name: "GET /api/orders",
        method: "GET",
        path: "/api/orders",
        status: 200,
        responseSchema: ordersContractSchema,
        contentType: "application/json",
        auth: true,
      },
      { token: authedUser.token },
    );

    expect(orders.length).toBeGreaterThanOrEqual(1);
    orders.forEach((order) => orderContractSchema.parse(order));
  });

  test("GET /api/orders/{id} returns Order contract", async ({ request, authedUser, cartApi, booksApi }) => {
    const book = await booksApi.first();
    await cartApi.addItem(book.id, 1);

    const checkoutResponse = await request.post("/api/orders/checkout", {
      headers: { Authorization: `Bearer ${authedUser.token}` },
    });
    const created = orderContractSchema.parse(await checkoutResponse.json());

    const order = await assertContract(
      request,
      {
        name: "GET /api/orders/{id}",
        method: "GET",
        path: (ctx) => `/api/orders/${ctx.orderId}`,
        status: 200,
        responseSchema: orderContractSchema,
        contentType: "application/json",
        auth: true,
      },
      { token: authedUser.token, orderId: created.id },
    );

    expect(order.id).toBe(created.id);
  });

  test("POST /api/orders/checkout empty cart returns error contract", async ({ request, authedUser }) => {
    const response = await request.post("/api/orders/checkout", {
      headers: { Authorization: `Bearer ${authedUser.token}` },
    });
    await assertJsonContract(response, 400, errorContractSchema, "POST /api/orders/checkout 400");
  });

  test("GET /api/orders without auth returns 401", async ({ request }) => {
    const response = await request.get("/api/orders");
    expect(response.status()).toBe(UNAUTHENTICATED_HTTP_STATUS);
  });
});
