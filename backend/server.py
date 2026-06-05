from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email config (optional - enquiries are always saved; email is sent only if configured)
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'Priya2goutham@gmail.com')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class EnquiryCreate(BaseModel):
    parent_name: str
    email: EmailStr
    phone: Optional[str] = ""
    child_name: str
    child_age: int = Field(ge=6, le=13)
    preferred_week: str
    programme_interest: str
    message: Optional[str] = ""


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    parent_name: str
    email: str
    phone: Optional[str] = ""
    child_name: str
    child_age: int
    preferred_week: str
    programme_interest: str
    message: Optional[str] = ""
    email_sent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Email helper ----------
def _build_email_html(e: Enquiry) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; color:#0F172A; max-width:600px;">
      <h2 style="color:#4338CA;">New Enquiry — La Neuron STEAM Academy</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px; font-weight:bold;">Parent/Guardian</td><td style="padding:8px;">{e.parent_name}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;">{e.email}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Phone/WhatsApp</td><td style="padding:8px;">{e.phone or '-'}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Child</td><td style="padding:8px;">{e.child_name} (age {e.child_age})</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Preferred week</td><td style="padding:8px;">{e.preferred_week}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Programme interest</td><td style="padding:8px;">{e.programme_interest}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Notes / requirements</td><td style="padding:8px;">{e.message or '-'}</td></tr>
        <tr><td style="padding:8px; font-weight:bold;">Submitted</td><td style="padding:8px;">{e.created_at}</td></tr>
      </table>
    </div>
    """


async def _send_owner_email(e: Enquiry) -> bool:
    if not RESEND_API_KEY:
        return False
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        params = {
            "from": SENDER_EMAIL,
            "to": [OWNER_EMAIL],
            "subject": f"New STEAM enquiry: {e.child_name} (age {e.child_age})",
            "html": _build_email_html(e),
        }
        await asyncio.to_thread(resend.Emails.send, params)
        return True
    except Exception as exc:
        logger.error(f"Failed to send enquiry email: {exc}")
        return False


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "La Neuron STEAM Academy API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in rows:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return rows


@api_router.post("/enquiries")
async def create_enquiry(payload: EnquiryCreate):
    enquiry = Enquiry(**payload.model_dump())
    enquiry.email_sent = await _send_owner_email(enquiry)
    await db.enquiries.insert_one(enquiry.model_dump())
    return {
        "status": "success",
        "id": enquiry.id,
        "email_sent": enquiry.email_sent,
        "message": "Enquiry received. A personal response will follow within 24 hours.",
    }


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries():
    rows = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Enquiry(**r) for r in rows]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
