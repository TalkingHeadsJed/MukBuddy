"""
Database layer — SQLAlchemy async ORM.

Driver is selected entirely by DATABASE_URL.

  • DEV (this pod):     sqlite+aiosqlite:////app/backend/dev_leads.db
  • PROD (Pair host):   mysql+aiomysql://user:pass@localhost:3306/working_mukbuddy

Same code, same SQL. No code change between dev and prod — only the env var.
"""
import os
from datetime import datetime, timezone
from typing import AsyncGenerator

from sqlalchemy import String, Text, DateTime, Index
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


DATABASE_URL = os.environ["DATABASE_URL"]

# SQLite needs check_same_thread disabled for async. MySQL ignores connect_args.
_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,  # detect stale MySQL connections after Pair restarts
    connect_args=_connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)


class Base(DeclarativeBase):
    pass


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)  # uuid4
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(25), nullable=True)
    crew_size: Mapped[str | None] = mapped_column(String(40), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(300), nullable=True)
    notified: Mapped[bool] = mapped_column(default=False, nullable=False)

    __table_args__ = (
        Index("ix_leads_email_created", "email", "created_at"),
        Index("ix_leads_created_at", "created_at"),
    )


async def init_db() -> None:
    """Create tables if they don't exist. Safe to call on every startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
