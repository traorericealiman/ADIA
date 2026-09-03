from datetime import date, datetime, time, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.base import Base, engine, SessionLocal
from app.core.security import hash_pin
import app.models.agency
import app.models.customer
import app.models.orange_money
import app.models.ownership
import app.models.audit
import app.models.ticket

from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.models.ticket import SupportTicket
from app.models.agency import Agency, Advisor

def ensure_seed_data(db: Session):
    """
    Vérifie et garantit que les profils de test (0708091011 et 0744556677)
    sont insérés et complets dans la base PostgreSQL (UPSERT).
    """
    try:
        # 1. Agence
        ag1 = db.query(Agency).filter(Agency.id == "AG-CI-ABJ-02").first()
        if not ag1:
            ag1 = Agency(
                id="AG-CI-ABJ-02",
                name="Agence Orange Cocody Angré 8e Tranche",
                city="Abidjan",
                address="Carrefour Bluetooth, 8e Tranche, Cocody",
                phone="+225 27 22 40 12 89",
                manager="Clarisse Kouamé"
            )
            db.add(ag1)
            db.flush()

        # 2. Conseiller
        adv1 = db.query(Advisor).filter(Advisor.id == "AG-225-ABJ-042").first()
        if not adv1:
            adv1 = Advisor(
                id="AG-225-ABJ-042",
                name="Roland KOFFI",
                email="roland.koffi@orange.ci",
                role="Conseiller Clientèle & OM",
                counter_number="Guichet 04",
                status="available",
                served_today_count=12,
                login_time=time(8, 15),
                agency_id="AG-CI-ABJ-02"
            )
            db.add(adv1)
            db.flush()

        # 3. Client 1 : Jean-Marc KOFFI (07 08 09 10 11)
        c1 = db.query(Customer).filter(Customer.id == "CUST-CI-001").first()
        if not c1:
            c1 = Customer(
                id="CUST-CI-001",
                first_name="Jean-Marc",
                last_name="KOFFI",
                gender="M",
                date_of_birth=date(1988, 5, 14),
                nationality="Ivoirienne",
                email="jeanmarc.koffi@gmail.com",
                address="Villa 142, Riviera Palmeraie",
                city="Abidjan",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                customer_since=date(2016, 3, 12),
            )
            db.add(c1)
            db.flush()

        # KYC 1
        kyc1 = db.query(KycDocument).filter(KycDocument.customer_id == "CUST-CI-001").first()
        if not kyc1:
            db.add(KycDocument(
                customer_id="CUST-CI-001",
                type="CNI",
                number="C01492049182",
                issued_date=date(2021, 2, 10),
                expiry_date=date(2031, 2, 10),
                issued_by="ONECI Côte d'Ivoire"
            ))

        # Telecom 1 (0708091011)
        tel1 = db.query(CustomerTelecom).filter(
            or_(
                CustomerTelecom.customer_id == "CUST-CI-001",
                CustomerTelecom.raw_phone == "0708091011"
            )
        ).first()
        if not tel1:
            db.add(CustomerTelecom(
                customer_id="CUST-CI-001",
                msisdn="07 08 09 10 11",
                raw_phone="0708091011",
                sim_iccid="89225 0100 4892 1042 1",
                imsi="612010489210421",
                network_type="4G+",
                offer_name="Formule Prépayé Orange Max 4G+",
                line_status="ACTIVE",
                status_reason=None,
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

        # Orange Money 1
        om1 = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == "CUST-CI-001").first()
        if not om1:
            db.add(CustomerOrangeMoney(
                customer_id="CUST-CI-001",
                account_number="0708091011",
                status="ACTIF",
                kyc_level="Niveau 2 (Plafond 5M)",
                daily_limit=1000000,
                monthly_limit=5000000,
                current_balance=345800,
                savings_vault_balance=50000,
                currency="FCFA",
                is_pin_blocked=False,
                pin_hash=hash_pin("0000")
            ))

        # Sim Ownership 1
        own1 = db.query(SimOwnershipRecord).filter(SimOwnershipRecord.customer_id == "CUST-CI-001").first()
        if not own1:
            db.add(SimOwnershipRecord(
                id="OWN-01",
                customer_id="CUST-CI-001",
                owner_name="Jean-Marc KOFFI",
                owner_id_document="CNI C01492049182",
                owner_phone_contact="07 08 09 10 11",
                period_start=date(2023, 3, 12),
                period_end=None,
                is_current=True,
                reason="Attribution initiale & Identification",
                agency="Agence Orange Cocody Angré 8e Tranche",
                registered_by_agent="Roland KOFFI (AG-225-ABJ-042)",
                notes="Dossier complet et validé."
            ))

        # Audit Log 1
        aud1 = db.query(AuditLogEntry).filter(AuditLogEntry.customer_id == "CUST-CI-001").first()
        if not aud1:
            db.add(AuditLogEntry(
                id="LOG-01",
                customer_id="CUST-CI-001",
                occurred_at=datetime.now(timezone.utc),
                category="KYC_IDENTIFICATION",
                action="Enrôlement & Activation Ligne",
                details="Vérification physique CNI et ouverture compte OM",
                agent_id="AG-225-ABJ-042",
                agent_name="Roland KOFFI",
                agency_name="Agence Orange Cocody Angré 8e Tranche"
            ))

        # 4. Client 2 : Marie-Josée ABLAN (07 44 55 66 77)
        c2 = db.query(Customer).filter(Customer.id == "CUST-CI-002").first()
        if not c2:
            c2 = Customer(
                id="CUST-CI-002",
                first_name="Marie-Josée",
                last_name="ABLAN",
                gender="F",
                date_of_birth=date(1993, 11, 25),
                nationality="Ivoirienne",
                email="marie.ablan@yahoo.fr",
                address="Rue des Jardins, Deux Plateaux",
                city="Abidjan",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                customer_since=date(2019, 8, 19),
            )
            db.add(c2)
            db.flush()

        kyc2 = db.query(KycDocument).filter(KycDocument.customer_id == "CUST-CI-002").first()
        if not kyc2:
            db.add(KycDocument(
                customer_id="CUST-CI-002",
                type="PASSEPORT",
                number="CI0982734",
                issued_date=date(2022, 6, 14),
                expiry_date=date(2027, 6, 14),
                issued_by="Ministère de l'Intérieur CI"
            ))

        tel2 = db.query(CustomerTelecom).filter(
            or_(
                CustomerTelecom.customer_id == "CUST-CI-002",
                CustomerTelecom.raw_phone == "0744556677"
            )
        ).first()
        if not tel2:
            db.add(CustomerTelecom(
                customer_id="CUST-CI-002",
                msisdn="07 44 55 66 77",
                raw_phone="0744556677",
                sim_iccid="89225 0100 9382 7481 0",
                imsi="612010938274810",
                network_type="5G",
                offer_name="Formule Postpayée Orange VIP 5G",
                line_status="ACTIVE",
                status_reason=None,
                activation_date=date(2022, 6, 14),
                puk1="92817402",
                puk2="59182739",
                current_pin="0000",
                main_credit=42000,
                currency="FCFA",
                credit_validity="Illimité",
                data_remaining_mb=45000,
                data_total_mb=50000,
                data_expiry=date(2026, 10, 1),
                sms_remaining=1200,
                bonus_orange=15000
            ))

        om2 = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == "CUST-CI-002").first()
        if not om2:
            db.add(CustomerOrangeMoney(
                customer_id="CUST-CI-002",
                account_number="0744556677",
                status="ACTIF",
                kyc_level="Niveau 3 (Plafond 10M)",
                daily_limit=2000000,
                monthly_limit=10000000,
                current_balance=1250000,
                savings_vault_balance=300000,
                currency="FCFA",
                is_pin_blocked=False,
                pin_hash=hash_pin("0000")
            ))

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Warning in ensure_seed_data: {e}")

def init_db():
    """Crée toutes les tables PostgreSQL et insère les profils de test."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        ensure_seed_data(db)
    finally:
        db.close()
