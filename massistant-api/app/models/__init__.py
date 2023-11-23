from datetime import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class KonspektUpload(Base):
    __tablename__ = "konspekt_uploads"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now, index=True)
    original_filename = Column(String, nullable=True)
    filename = Column(String, index=True, unique=True)
    status = Column(String, default="new")
