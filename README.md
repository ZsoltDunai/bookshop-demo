# Bookshop Demo

A simple webshop demo with a **Python (FastAPI)** backend and **TypeScript Playwright** API + UI tests.

## Features

- User registration and JWT login
- Browse a catalog of books
- Add/remove items from cart
- Checkout and view order history
- Static HTML frontend served by FastAPI

## Project Structure

```
bookshop-demo/
├── .github/workflows/  # CI/CD pipelines
│   ├── ci.yml          # Test on push/PR
│   └── cd.yml          # Publish image on main
├── backend/            # FastAPI app + static frontend
│   ├── Dockerfile
│   ├── app/          # API routes, models, auth
│   └── static/       # HTML/CSS/JS pages
├── tests/            # Playwright TypeScript tests
│   ├── Dockerfile
│   ├── api/          # API test specs
│   └── ui/           # UI test specs
└── docker-compose.yml
```

## Quick Start

### Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# Start the webshop
docker compose up --build

# Run Playwright tests (backend must be running, or use the one-liner below)
docker compose --profile test run --rm tests

# Build and run backend + tests in one go (CI-style)
docker compose --profile test up --build --abort-on-container-exit
```

Open http://localhost:8000

**Demo account:** `demo@bookshop.io` / `password123`

Stop everything:

```bash
docker compose down
```

To reset the database:

```bash
docker compose down -v
```

### 1. Backend (local)

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000

**Demo account:** `demo@bookshop.io` / `password123`

### 2. Tests

```bash
cd tests
npm install
npx playwright install chromium
npm test
```

Run only API or UI tests:

```bash
npm run test:api
npm run test:ui
```

Playwright starts the backend automatically via `webServer` in `playwright.config.ts`.

## CI/CD

GitHub Actions workflows run automatically when the repo is pushed to GitHub.

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| **CI** (`.github/workflows/ci.yml`) | Push / PR to `main` | Builds Docker images, starts backend, runs Playwright API + UI tests |
| **CD** (`.github/workflows/cd.yml`) | Push to `main`, version tags (`v*`), or manual | Runs tests, publishes backend image to GHCR, optional deploy |

### Setup

1. Create a GitHub repo and push this project:

```bash
git init
git add .
git commit -m "Add bookshop demo with Docker and CI/CD"
git remote add origin https://github.com/<you>/bookshop-demo.git
git push -u origin main
```

2. CI runs on every push and pull request — no secrets required.

3. CD publishes the backend image to **GitHub Container Registry** (`ghcr.io/<you>/bookshop-demo/backend`). Make the package public under **Packages → backend → Package settings** if you want to pull without auth.

4. Optional manual deploy: **Actions → CD → Run workflow** → check **Run deploy job**.

### View results

- **Actions** tab — workflow runs and logs
- Failed test runs upload a **playwright-report** artifact (HTML report + traces)

### Local equivalent

```bash
# Same as CI
docker compose up -d --build backend
docker compose --profile test run --rm tests
docker compose down -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user (auth required) |
| GET | `/api/books` | List all books |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/cart` | Get cart (auth required) |
| POST | `/api/cart/items` | Add to cart |
| PATCH | `/api/cart/items/{id}` | Update quantity |
| DELETE | `/api/cart/items/{id}` | Remove item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/orders/checkout` | Checkout cart |
| GET | `/api/orders` | List orders |
| GET | `/health` | Health check |

Interactive API docs: http://127.0.0.1:8000/docs

## Test IDs

UI elements use `data-testid` attributes for stable Playwright selectors (e.g. `login-submit`, `add-to-cart`, `checkout-btn`).
