"""Backend tests for La Neuron STEAM Academy enquiry endpoints."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://neuron-discovery.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Enquiries ----------
class TestEnquiriesCreate:
    def test_create_enquiry_success_and_persistence(self, session):
        unique = uuid.uuid4().hex[:8]
        payload = {
            "parent_name": f"TEST_Parent_{unique}",
            "email": f"test_{unique}@example.com",
            "phone": "+48 555 123 456",
            "child_name": f"TEST_Child_{unique}",
            "child_age": 9,
            "preferred_week": "Week 1: 30 Jun – 4 Jul",
            "programme_interest": "Summer Camp 2026",
            "message": "TEST enquiry message",
        }
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "success"
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        # email_sent should be False since RESEND_API_KEY is not set (per spec)
        assert data["email_sent"] is False
        assert "message" in data
        new_id = data["id"]

        # Verify persistence
        r2 = session.get(f"{API}/enquiries")
        assert r2.status_code == 200
        rows = r2.json()
        assert isinstance(rows, list)
        match = [row for row in rows if row.get("id") == new_id]
        assert len(match) == 1, f"Newly-created enquiry {new_id} not found via GET"
        rec = match[0]
        assert rec["parent_name"] == payload["parent_name"]
        assert rec["email"] == payload["email"]
        assert rec["child_name"] == payload["child_name"]
        assert rec["child_age"] == payload["child_age"]
        assert rec["preferred_week"] == payload["preferred_week"]
        assert rec["programme_interest"] == payload["programme_interest"]
        # Mongo _id MUST NOT leak
        assert "_id" not in rec

    def test_create_enquiry_minimal_valid_no_phone_no_message(self, session):
        unique = uuid.uuid4().hex[:8]
        payload = {
            "parent_name": f"TEST_Min_{unique}",
            "email": f"min_{unique}@example.com",
            "child_name": f"TEST_MinChild_{unique}",
            "child_age": 4,
            "preferred_week": "Week 2",
            "programme_interest": "After-school",
        }
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "success"

    def test_create_enquiry_child_age_too_low(self, session):
        payload = {
            "parent_name": "TEST_X", "email": "x@example.com", "child_name": "TEST_C",
            "child_age": 2, "preferred_week": "Week 1", "programme_interest": "Camp",
        }
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_create_enquiry_child_age_too_high(self, session):
        payload = {
            "parent_name": "TEST_X", "email": "x@example.com", "child_name": "TEST_C",
            "child_age": 20, "preferred_week": "Week 1", "programme_interest": "Camp",
        }
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_create_enquiry_invalid_email(self, session):
        payload = {
            "parent_name": "TEST_X", "email": "not-an-email", "child_name": "TEST_C",
            "child_age": 9, "preferred_week": "Week 1", "programme_interest": "Camp",
        }
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_create_enquiry_missing_required(self, session):
        # missing parent_name, child_name, preferred_week, programme_interest
        payload = {"email": "x@example.com", "child_age": 9}
        r = session.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422


class TestEnquiriesList:
    def test_list_enquiries_returns_list(self, session):
        r = session.get(f"{API}/enquiries")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for row in data:
            assert "_id" not in row
            assert "id" in row
            assert "email_sent" in row
