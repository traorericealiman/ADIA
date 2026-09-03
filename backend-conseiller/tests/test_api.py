from datetime import date, datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base, get_db
from app.main import app
from app.core.security import hash_pin
from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry

# In-memory SQLite for sandboxed local testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine_test = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

Base.metadata.create_all(bind=engine_test)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def setup_module():
    db = TestingSessionLocal()
    c = Customer(
        id="CUST-TEST-001",
        first_name="Jean-Marc",
        last_name="KOFFI",
        gender="M",
        date_of_birth=date(1988, 5, 14),
        nationality="Ivoirienne",
        email="jeanmarc.koffi@gmail.com",
        address="Riviera Palmeraie",
        city="Abidjan",
        avatar_url="https://images.unsplash.com/photo-1507003211169",
        customer_since=date(2016, 3, 12),
    )
    db.add(c)
    db.add(KycDocument(
        customer_id="CUST-TEST-001",
        type="CNI",
        number="C01492049182",
        issued_date=date(2021, 2, 10),
        expiry_date=date(2031, 2, 10),
        issued_by="ONECI Côte d'Ivoire"
    ))
    db.add(CustomerTelecom(
        customer_id="CUST-TEST-001",
        msisdn="07 08 09 10 11",
        raw_phone="0708091011",
        sim_iccid="89225 0100 4892 1042 1",
        imsi="612010489210421",
        network_type="4G+",
        offer_name="Formule Prépayé Orange Max 4G+",
        line_status="ACTIVE",
        activation_date=date(2023, 3, 12),
        puk1="84920194",
        puk2="10492841",
        current_pin="0000",
        main_credit=14500,
        currency="FCFA",
        credit_validity="31/12/2026",
        data_remaining_mb=18840,
        data_total_mb=25600,
        data_expiry=date(2026, 9, 15),
        sms_remaining=450,
        bonus_orange=5000
    ))
    db.add(CustomerOrangeMoney(
        customer_id="CUST-TEST-001",
        account_number="0708091011",
        status="ACTIF",
        kyc_level="Niveau 2",
        daily_limit=1000000,
        monthly_limit=5000000,
        current_balance=345800,
        savings_vault_balance=50000,
        currency="FCFA",
        is_pin_blocked=False,
        pin_hash=hash_pin("0000")
    ))
    db.add(SimOwnershipRecord(
        id="OWN-01",
        customer_id="CUST-TEST-001",
        owner_name="Jean-Marc KOFFI",
        owner_id_document="CNI C01492049182",
        owner_phone_contact="07 08 09 10 11",
        period_start=date(2023, 3, 12),
        period_end=None,
        is_current=True,
        reason="Attribution de ligne",
        agency="Agence Cocody",
        registered_by_agent="Roland Koffi",
        notes="Conforme"
    ))
    db.add(AuditLogEntry(
        id="LOG-01",
        customer_id="CUST-TEST-001",
        occurred_at=datetime.now(timezone.utc),
        category="KYC_IDENTIFICATION",
        action="Enrôlement ligne",
        details="Création de compte",
        agent_id="AG-001",
        agent_name="Roland Koffi",
        agency_name="Agence Cocody"
    ))
    db.commit()
    db.close()

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("✓ test_health passed")

def test_auth_by_phone_number_only():
    """Vérifie que la connexion se fait UNIQUEMENT avec le numéro de téléphone (aucun mot de passe)."""
    payload = {"msisdn": "07 08 09 10 11"}
    res = client.post("/v1/auth/customer-session", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["first_name"] == "Jean-Marc"
    assert data["last_name"] == "KOFFI"
    assert data["customer_id"] == "CUST-TEST-001"
    print("✓ test_auth_by_phone_number_only passed")

def test_customer_lookup_full_360_profile():
    """Vérifie que la recherche par numéro renvoie le profil 360 complet."""
    payload = {"msisdn": "0708091011"}
    res = client.post("/v1/customers/lookup", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["first_name"] == "Jean-Marc"
    assert data["last_name"] == "KOFFI"
    assert data["kyc_document"]["number"] == "C01492049182"
    assert data["telecom"]["puk1"] == "84920194"
    assert data["telecom"]["balances"]["main_credit"] == 14500
    assert data["orange_money"]["current_balance"] == 345800
    assert len(data["ownership_history"]) >= 1
    assert len(data["action_audit_logs"]) >= 1
    print("✓ test_customer_lookup_full_360_profile passed")

def test_customer_by_phone_url_param():
    """Vérifie la récupération par URL GET /v1/customers/by-phone/{phone}."""
    res = client.get("/v1/customers/by-phone/0708091011")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "CUST-TEST-001"
    assert data["telecom"]["msisdn"] == "07 08 09 10 11"
    print("✓ test_customer_by_phone_url_param passed")

def test_customer_not_found():
    """Vérifie l'erreur 404 si le numéro n'existe pas."""
    res = client.post("/v1/customers/lookup", json={"msisdn": "0799999999"})
    assert res.status_code == 404
    print("✓ test_customer_not_found passed")

if __name__ == "__main__":
    setup_module()
    test_health()
    test_auth_by_phone_number_only()
    test_customer_lookup_full_360_profile()
    test_customer_by_phone_url_param()
    test_customer_not_found()
    print("\nTous les tests du backend-conseiller sont passés avec succès (5/5) !")
