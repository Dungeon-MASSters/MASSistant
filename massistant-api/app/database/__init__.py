from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

db_url = os.getenv("POSTGRES_URL")
if db_url is None:
    raise RuntimeError("Missing POSTGRES_URL env var")

SQLALCHEMY_DATABASE_URL = db_url

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
