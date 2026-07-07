export const DEMO_USER = {
  email: "demo@bookshop.io",
  password: "password123",
} as const;

export const DEFAULT_PASSWORD = "password123";

export const API_TIMEOUTS = {
  health: 500,
  booksList: 1000,
  login: 1500,
  concurrentBooks: 3000,
} as const;

/** FastAPI HTTPBearer returns 401 when credentials are missing or invalid. */
export const UNAUTHENTICATED_HTTP_STATUS = 401;
