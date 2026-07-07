from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Book, User
from app.auth import hash_password


BOOKS = [
    ("The Great Gatsby", "F. Scott Fitzgerald", 12.99, 10),
    ("1984", "George Orwell", 10.49, 15),
    ("To Kill a Mockingbird", "Harper Lee", 11.99, 8),
    ("Pride and Prejudice", "Jane Austen", 9.99, 12),
    ("The Hobbit", "J.R.R. Tolkien", 14.99, 20),
    ("Dune", "Frank Herbert", 13.49, 6),
]


def seed_database(db: Session) -> None:
    if db.query(Book).count() == 0:
        for title, author, price, stock in BOOKS:
            db.add(Book(title=title, author=author, price=price, stock=stock))

    demo_user = db.query(User).filter(User.email == "demo@bookshop.io").first()
    if not demo_user:
        db.add(User(email="demo@bookshop.io", hashed_password=hash_password("password123")))

    db.commit()


def run_seed() -> None:
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
