from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class KonspektUpload(Base):
    __tablename__ = "konspekt_uploads"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now,
                        index=True, nullable=False)
    original_filename = Column(String, nullable=True)
    filename = Column(String, index=True, unique=True, nullable=False)
    status = Column(String, default="new", nullable=False)
    transcribe = Column(Text, nullable=True)
    summary = Column(JSONB, nullable=True)
    glossary = Column(JSONB, nullable=True)
