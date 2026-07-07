import { test } from "@helpers/fixtures";
import { assertContract } from "@helpers/contract";
import { healthContractSchema } from "@helpers/contract/schemas";

test.describe("Health API contract", () => {
  test("GET /health returns Health contract", async ({ request }) => {
    await assertContract(request, {
      name: "GET /health",
      method: "GET",
      path: "/health",
      status: 200,
      responseSchema: healthContractSchema,
      contentType: "application/json",
    });
  });
});
