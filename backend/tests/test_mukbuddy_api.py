"""
Backend tests for Muk Buddy API:
- /api/health
- /api/leads (validation, honeypot, rate limit, persistence)
- Security headers
- Public docs endpoints disabled
"""
import os
import time
import uuid
import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback to frontend/.env
    from pathlib import Path
    env = Path("/app/frontend/.env").read_text()
    for line in env.splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip()
            break

BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def mongo():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


def _unique_ip_headers():
    """Use unique X-Forwarded-For per test to avoid rate-limit cross-pollution."""
    ip = f"10.{uuid.uuid4().int % 255}.{uuid.uuid4().int % 255}.{uuid.uuid4().int % 255}"
    return {"X-Forwarded-For": ip}


# ---------- Health ----------
class TestHealth:
    def test_health(self, session):
        r = session.get(f"{API}/health", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "healthy"


# ---------- Security ----------
class TestSecurity:
    def test_security_headers(self, session):
        r = session.get(f"{API}/health", timeout=10)
        assert r.status_code == 200
        h = r.headers
        assert h.get("X-Content-Type-Options") == "nosniff"
        assert h.get("X-Frame-Options") == "DENY"
        assert "Referrer-Policy" in h
        assert "Permissions-Policy" in h
        assert "Strict-Transport-Security" in h

    @pytest.mark.parametrize("path", ["/docs", "/redoc", "/openapi.json"])
    def test_docs_disabled(self, session, path):
        """Backend docs should be disabled. Note: due to k8s ingress, non-/api
        routes are served by the React SPA, so we verify the response is NOT
        actual Swagger/ReDoc/OpenAPI content."""
        r = session.get(f"{BASE_URL}{path}", timeout=10)
        body = r.text.lower()
        # Should not contain swagger/redoc UI assets nor OpenAPI JSON schema
        assert "swagger-ui" not in body, f"{path} exposes Swagger UI"
        assert "redoc" not in body or "<html" in body, f"{path} exposes ReDoc"
        if path.endswith(".json"):
            # If reachable as JSON, must NOT be the openapi schema
            try:
                j = r.json()
                assert "openapi" not in j and "paths" not in j, "OpenAPI schema is exposed"
            except ValueError:
                pass  # not JSON => SPA fallback, fine


# ---------- Leads ----------
class TestLeads:
    def test_create_lead_success(self, session, mongo):
        payload = {
            "name": "TEST Contractor",
            "email": "test_contractor@example.com",
            "phone": "+1 555-123-4567",
            "crew_size": "2-4 crews",
            "message": "Interested in volume pricing for our crew.",
        }
        r = session.post(f"{API}/leads", json=payload, headers=_unique_ip_headers(), timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        # Sanitized response
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["crew_size"] == payload["crew_size"]
        assert data["message"] == payload["message"]
        # No leakage
        assert "_id" not in data
        assert "meta" not in data

        # Persistence verification via pymongo
        doc = mongo.leads.find_one({"id": data["id"]})
        assert doc is not None
        assert doc["email"] == payload["email"]
        # cleanup
        mongo.leads.delete_one({"id": data["id"]})

    def test_invalid_email(self, session):
        payload = {
            "name": "TEST User",
            "email": "not-an-email",
            "message": "Hello there",
        }
        r = session.post(f"{API}/leads", json=payload, headers=_unique_ip_headers(), timeout=10)
        assert r.status_code == 422

    def test_short_name(self, session):
        payload = {
            "name": "A",
            "email": "good@example.com",
            "message": "Hello there",
        }
        r = session.post(f"{API}/leads", json=payload, headers=_unique_ip_headers(), timeout=10)
        assert r.status_code == 422

    def test_short_message(self, session):
        payload = {
            "name": "TEST User",
            "email": "good@example.com",
            "message": "hi",
        }
        r = session.post(f"{API}/leads", json=payload, headers=_unique_ip_headers(), timeout=10)
        assert r.status_code == 422

    def test_honeypot(self, session, mongo):
        payload = {
            "name": "TEST Bot",
            "email": "bot@example.com",
            "message": "I am a bot filling website",
            "website": "http://spam.example.com",
        }
        r = session.post(f"{API}/leads", json=payload, headers=_unique_ip_headers(), timeout=10)
        assert r.status_code == 400
        # Should not be persisted
        assert mongo.leads.find_one({"email": "bot@example.com"}) is None

    def test_rate_limit(self, session, mongo):
        ip = f"10.99.{uuid.uuid4().int % 255}.{uuid.uuid4().int % 255}"
        headers = {"X-Forwarded-For": ip, "Content-Type": "application/json"}
        ids_created = []
        statuses = []
        for i in range(6):
            payload = {
                "name": f"TEST Rate {i}",
                "email": f"test_rate_{i}_{uuid.uuid4().hex[:6]}@example.com",
                "message": "Rate limit probe message",
            }
            r = session.post(f"{API}/leads", json=payload, headers=headers, timeout=10)
            statuses.append(r.status_code)
            if r.status_code == 201:
                ids_created.append(r.json()["id"])
        # First 5 should be 201, the 6th should be 429
        assert statuses[:5] == [201, 201, 201, 201, 201], f"Expected 5x201, got {statuses}"
        assert statuses[5] == 429, f"Expected 429 for 6th request, got {statuses[5]}"
        # Cleanup
        for _id in ids_created:
            mongo.leads.delete_one({"id": _id})
