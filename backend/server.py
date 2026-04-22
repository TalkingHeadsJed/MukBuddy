from fastapi import FastAPI, APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import time
from collections import defaultdict, deque
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import Optional, Deque, Dict
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("mukbuddy")

app = FastAPI(
    title="Muk Buddy API",
    docs_url=None,   # disable public docs to reduce attack surface
    redoc_url=None,
    openapi_url=None,
)

api_router = APIRouter(prefix="/api")


# ---------- Security middleware ----------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        return response


# ---------- Simple in-memory rate limiter (per-IP sliding window) ----------
_RATE_WINDOW_SEC = 60
_RATE_MAX_REQUESTS = 5
_rate_buckets: Dict[str, Deque[float]] = defaultdict(deque)


def _rate_limit_check(ip: str) -> bool:
    now = time.time()
    bucket = _rate_buckets[ip]
    while bucket and now - bucket[0] > _RATE_WINDOW_SEC:
        bucket.popleft()
    if len(bucket) >= _RATE_MAX_REQUESTS:
        return False
    bucket.append(now)
    return True


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# ---------- Models ----------
_PHONE_RE = re.compile(r"^[0-9+\-\s().]{7,20}$")


class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=25)
    crew_size: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(..., min_length=5, max_length=2000)
    website: Optional[str] = Field(default=None, max_length=200)  # honeypot

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v in (None, ""):
            return None
        if not _PHONE_RE.match(v):
            raise ValueError("Invalid phone")
        return v

    @field_validator("name")
    @classmethod
    def strip_control(cls, v: str) -> str:
        return re.sub(r"[\x00-\x1f\x7f]", "", v).strip()


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    crew_size: Optional[str] = None
    message: str
    created_at: datetime


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"status": "ok", "service": "muk-buddy"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "time": datetime.now(timezone.utc).isoformat()}


@api_router.post("/leads", response_model=Lead, status_code=status.HTTP_201_CREATED)
async def create_lead(payload: LeadCreate, request: Request):
    ip = _client_ip(request)

    # Honeypot: silently reject bots
    if payload.website:
        logger.warning("Honeypot triggered from %s", ip)
        raise HTTPException(status_code=400, detail="Invalid submission")

    if not _rate_limit_check(ip):
        logger.warning("Rate limit exceeded from %s", ip)
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    lead_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)

    doc = {
        "id": lead_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "crew_size": payload.crew_size,
        "message": payload.message,
        "created_at": created_at.isoformat(),
        "meta": {
            "ip": ip,
            "user_agent": (request.headers.get("user-agent") or "")[:300],
        },
    }

    try:
        await db.leads.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to insert lead: %s", e)
        raise HTTPException(status_code=500, detail="Unable to save. Please try again.")

    logger.info("Lead captured: %s (%s)", lead_id, payload.email)

    return Lead(
        id=lead_id,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        crew_size=payload.crew_size,
        message=payload.message,
        created_at=created_at,
    )


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(SecurityHeadersMiddleware)

# CORS
_cors = os.environ.get("CORS_ORIGINS", "*")
_allow_origins = [o.strip() for o in _cors.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=_allow_origins if _allow_origins != ["*"] else ["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
    max_age=600,
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
