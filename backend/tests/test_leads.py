"""Backend tests for the lead-form endpoint. Runs against the SQLite dev DB."""
import asyncio
import os
import sys
import uuid
from pathlib import Path

# Make backend importable as a package root.
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

# Use an isolated test DB so we don't pollute dev_leads.db.
TEST_DB = ROOT / "tests_leads.db"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{TEST_DB}"
os.environ.setdefault("CORS_ORIGINS", "*")

import pytest
from httpx import AsyncClient, ASGITransport

from server import app  # noqa: E402
from db import init_db, engine, AsyncSessionLocal, Lead  # noqa: E402
from sqlalchemy import select  # noqa: E402


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def _setup_db():
    # Fresh DB for each test session.
    if TEST_DB.exists():
        TEST_DB.unlink()
    await init_db()
    yield
    await engine.dispose()
    if TEST_DB.exists():
        TEST_DB.unlink()


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c


def _payload(**overrides):
    base = {
        "name": "Test Contractor",
        "email": f"test{uuid.uuid4().hex[:6]}@example.com",
        "phone": "555-1234",
        "crew_size": "3 crew",
        "message": "Interested in trying Muk Buddy for our crew.",
    }
    base.update(overrides)
    return base


# ---------- Health ----------
@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ---------- Happy path ----------
@pytest.mark.asyncio
async def test_create_lead_happy_path(client):
    p = _payload()
    r = await client.post("/api/leads", json=p)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["email"] == p["email"]
    assert len(body["id"]) == 36
    # Verify row landed in DB.
    async with AsyncSessionLocal() as s:
        row = (await s.execute(select(Lead).where(Lead.id == body["id"]))).scalar_one()
        assert row.message == p["message"]
        assert row.notified is False


# ---------- Validation ----------
@pytest.mark.asyncio
async def test_invalid_email_rejected(client):
    r = await client.post("/api/leads", json=_payload(email="not-an-email"))
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_short_name_rejected(client):
    r = await client.post("/api/leads", json=_payload(name="A"))
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_extra_field_rejected(client):
    # extra=forbid — unknown fields should 422
    p = _payload()
    p["admin"] = True
    r = await client.post("/api/leads", json=p)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_invalid_phone_rejected(client):
    r = await client.post("/api/leads", json=_payload(phone="abc!!"))
    assert r.status_code == 422


# ---------- Security ----------
@pytest.mark.asyncio
async def test_honeypot_blocks_bots(client):
    r = await client.post(
        "/api/leads", json=_payload(website="http://spammy.example.com")
    )
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_security_headers_present(client):
    r = await client.get("/api/health")
    for h in (
        "x-content-type-options",
        "x-frame-options",
        "referrer-policy",
        "permissions-policy",
        "strict-transport-security",
    ):
        assert h in r.headers, f"missing {h}"


# ---------- Rate limiting ----------
@pytest.mark.asyncio
async def test_rate_limit_after_5_requests(client):
    # Force a unique IP by setting X-Forwarded-For so we don't trip earlier tests.
    headers = {"X-Forwarded-For": "203.0.113.99"}
    for i in range(5):
        r = await client.post("/api/leads", json=_payload(), headers=headers)
        assert r.status_code == 201, f"req {i} got {r.status_code}: {r.text}"
    # 6th must be blocked.
    r = await client.post("/api/leads", json=_payload(), headers=headers)
    assert r.status_code == 429
