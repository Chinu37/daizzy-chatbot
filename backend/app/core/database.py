from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# SQLite database file
DATABASE_URL = "sqlite:///./app/data/daizzy.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ─── Models ───────────────────────────────────────────

class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    address = Column(String, nullable=False)
    payment_method = Column(String, default="COD")
    total = Column(Float, nullable=False)
    status = Column(String, default="confirmed")
    items = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime, default=datetime.now)

class CartDB(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Integer, default=1)

class ChatHistoryDB(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

class StyleProfileDB(Base):
    __tablename__ = "style_profiles"
    user_id = Column(String, primary_key=True)
    styles = Column(String, nullable=False)  # JSON string
    occasions = Column(String, nullable=False)  # JSON string
    gender = Column(String, nullable=False)
    price_range = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.now)

class SupportTicketDB(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False, default="guest")
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.now)

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()