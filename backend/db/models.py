from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String, nullable=False)
    email    = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    trips         = relationship("Trip", back_populates="user", cascade="all, delete")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete")

class Trip(Base):
    __tablename__ = "trips"
    id                = Column(Integer, primary_key=True, index=True)
    destination       = Column(String, nullable=False)
    days              = Column(Integer, nullable=False)
    budget            = Column(Float, nullable=False)
    daily_budget      = Column(Float, nullable=False)
    category          = Column(String, nullable=False)
    ai_recommendation = Column(Text, nullable=True)
    user_id           = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="trips")

class Conversation(Base):
    __tablename__ = "conversations"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, default="New Conversation")
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user     = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete")

class Message(Base):
    __tablename__ = "messages"
    id              = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role            = Column(String, nullable=False)
    content         = Column(Text, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    conversation = relationship("Conversation", back_populates="messages")
