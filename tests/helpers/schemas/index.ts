import { z } from "zod";

export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  price: z.number(),
  stock: z.number(),
});

export const booksSchema = z.array(bookSchema);

export const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const cartItemSchema = z.object({
  id: z.number(),
  book_id: z.number(),
  quantity: z.number(),
  book: bookSchema,
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number(),
});

export const orderItemSchema = z.object({
  id: z.number(),
  book_id: z.number(),
  quantity: z.number(),
  unit_price: z.number(),
  book: bookSchema,
});

export const orderSchema = z.object({
  id: z.number(),
  total: z.number(),
  status: z.string(),
  created_at: z.string(),
  items: z.array(orderItemSchema),
});

export const ordersSchema = z.array(orderSchema);

export const healthSchema = z.object({
  status: z.string(),
});

export const errorSchema = z.object({
  detail: z.union([z.string(), z.array(z.unknown())]),
});

export type BookSchema = z.infer<typeof bookSchema>;
export type CartSchema = z.infer<typeof cartSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
