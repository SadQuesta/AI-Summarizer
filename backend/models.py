from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime,Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
from backend.database import Base

# Kullanıcı modeli
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True,default=None)
    banner_url = Column(String, nullable=True)
    role=Column(String, default="user")
    summaries = relationship("Summary", back_populates="user", cascade="all, delete-orphan")


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    summary = Column(Text)
    format = Column(String)  # ← ✅ bunu ekle
    main_idea = Column(Text)
    key_points = Column(Text)
    conclusion = Column(Text)
    tags = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_favorite = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="summaries")