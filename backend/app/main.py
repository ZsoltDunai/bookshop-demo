from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import Base, SessionLocal, engine
from app.routers import auth, books, cart, orders
from app.seed import seed_database

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(title="Bookshop Demo", version="1.0.0")

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(cart.router)
app.include_router(orders.router)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/login")
def login_page():
    return FileResponse(STATIC_DIR / "login.html")


@app.get("/shop")
def shop_page():
    return FileResponse(STATIC_DIR / "shop.html")


@app.get("/cart")
def cart_page():
    return FileResponse(STATIC_DIR / "cart.html")


@app.get("/orders")
def orders_page():
    return FileResponse(STATIC_DIR / "orders.html")


@app.get("/health")
def health():
    return {"status": "ok"}
