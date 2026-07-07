from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "demo-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./bookshop.db"


settings = Settings()
