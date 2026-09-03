from datetime import date, datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.core.security import hash_pin
from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.routers.customer import (
    get_customer_by_path_phone, 
    get_customer_by_query_phone,
    get_titulaire_actuel,
    get_titulaire_actuel_by_query
)

# In-memory SQLite for sandboxed testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine_test = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)
Base.metadata.create_all(bind=engine_test)

def run_tests():
    db = TestingSessionLocal()
    c = Customer(
        id="CUST-CI-001",
        first_name="Jean-Marc",
        last_name="KOFFI",
        gender="M",
        date_of_birth=date(1988, 5, 14),
        nationality="Ivoirienne",
        email="jeanmarc.koffi@gmail.com",
        address="Villa 142, Riviera Palmeraie",
        city="Abidjan",
        avatar_url="https://images.unsplash.com/photo-1507003211169",
        customer_since=date(2016, 3, 12),
    )
    db.add(c)
    db.add(KycDocument(
        customer_id="CUST-CI-001",
        type="CNI",
        number="C01492049182",
        issued_date=date(2021, 2, 10),
        expiry_date=date(2031, 2, 10),
        issued_by="ONECI Côte d'Ivoire"
    ))
    db.add(CustomerTelecom(
        customer_id="CUST-CI-001",
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
        customer_id="CUST-CI-001",
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
        customer_id="CUST-CI-001",
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
        customer_id="CUST-CI-001",
        occurred_at=datetime.now(timezone.utc),
        category="KYC_IDENTIFICATION",
        action="Enrôlement ligne",
        details="Création de compte",
        agent_id="AG-001",
        agent_name="Roland Koffi",
        agency_name="Agence Cocody"
    ))
    db.commit()

    # Test 1 : GET Titulaire Actuel (GET /v1/titulaire/0708091011)
    print("Test 1 : GET /v1/titulaire/0708091011...")
    titulaire = get_titulaire_actuel("0708091011", db=db)
    assert titulaire.nom == "KOFFI"
    assert titulaire.prenoms == "Jean-Marc"
    assert titulaire.nom_complet == "Jean-Marc KOFFI"
    assert titulaire.genre_label == "Homme"
    assert titulaire.piece_identite.number == "C01492049182"
    assert titulaire.nationalite == "Ivoirienne"
    assert titulaire.adresse_residence == "Villa 142, Riviera Palmeraie"
    assert titulaire.ville == "Abidjan"
    assert titulaire.statut_ligne == "ACTIVE"
    print("✓ Test 1 Réussi : Données du Titulaire Actuel de la Puce parfaitement extraites !")

    # Test 2 : GET Titulaire par Query Parameter (GET /v1/titulaire?msisdn=07 08 09 10 11)
    print("Test 2 : GET /v1/titulaire?msisdn=07 08 09 10 11...")
    titulaire_q = get_titulaire_actuel_by_query("07 08 09 10 11", db=db)
    assert titulaire_q.nom_complet == "Jean-Marc KOFFI"
    print("✓ Test 2 Réussi !")

    # Test 3 : GET Profil 360 Complet (GET /v1/customer/0708091011)
    print("Test 3 : GET /v1/customer/0708091011...")
    p1 = get_customer_by_path_phone("0708091011", db=db)
    assert p1.id == "CUST-CI-001"
    assert p1.first_name == "Jean-Marc"
    print("✓ Test 3 Réussi !")

    db.close()
    print("\n✅ TOUS LES TESTS DE L'API TITULAIRE ACTUEL SONT VALIDÉS (3/3) !")

if __name__ == "__main__":
    run_tests()
