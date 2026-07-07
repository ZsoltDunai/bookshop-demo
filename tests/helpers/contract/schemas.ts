import { z } from "zod";
import {
  bookSchema,
  booksSchema,
  cartItemSchema,
  cartSchema,
  errorSchema,
  healthSchema,
  orderSchema,
  ordersSchema,
  tokenSchema,
  userSchema,
} from "../schemas";

export const validationErrorSchema = z.object({
  detail: z.array(
    z
      .object({
        type: z.string(),
        loc: z.array(z.union([z.string(), z.number()])),
        msg: z.string(),
      })
      .passthrough(),
  ),
});

export const bookContractSchema = bookSchema.strict();
export const booksContractSchema = booksSchema;
export const tokenContractSchema = tokenSchema.strict();
export const userContractSchema = userSchema.strict();
export const cartItemContractSchema = cartItemSchema.strict();
export const cartContractSchema = cartSchema.strict();
export const orderContractSchema = orderSchema.strict();
export const ordersContractSchema = ordersSchema;
export const healthContractSchema = healthSchema.strict();
export const errorContractSchema = errorSchema;
export const unauthorizedErrorSchema = z.object({ detail: z.string() });
