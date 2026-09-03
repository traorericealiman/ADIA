import uuid
from datetime import date, datetime, time, timezone
from app.db.base import Base, engine, SessionLocal
from app.core.security import hash_pin
from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.models.agency import Agency, Advisor
from app.models.ticket import SupportTicket

def init_database():
    print("Création de toutes les tables PostgreSQL...")
    Base.metadata.create_all(bind=engine)
    print("Tables créées avec succès !")

    db = SessionLocal()
    try:
        # Vérifier si déjà des clients
        if db.query(Customer).count() > 0:
            print("Des données existent déjà dans la base.")
            return

        print("Insertion des données de démonstration Orange Côte d'Ivoire...")

        # 1. Agences
        ag_cocody = Agency(
            id="AG-CI-ABJ-02",
            name="Agence Orange Cocody Angré 8e Tranche",
            city="Abidjan",
            address="Carrefour Bluetooth, 8e Tranche, Cocody",
            phone="+225 27 22 40 12 89",
            manager="Clarisse Kouamé"
        )
        ag_plateau = Agency(
            id="AG-CI-ABJ-01",
            name="Smart Store Orange Plateau (Siège)",
            city="Abidjan",
            address="Boulevard de la République, Plateau",
            phone="+225 27 20 20 00 00",
            manager="Mamadou Bamba"
        )
        db.add_all([ag_cocody, ag_plateau])

        # 2. Conseiller
        adv = Advisor(
            id="AG-225-ABJ-042",
            name="Roland KOFFI",
            email="roland.koffi@orange.ci",
            agency_id="AG-CI-ABJ-02",
            role="Conseiller Clientèle & OM",
            counter_number="Guichet 04",
            status="available",
            served_today_count=12,
            login_time=time(8, 15)
        )
        db.add(adv)

        # 3. Client 1 : Jean-Marc KOFFI (07 08 09 10 11)
        c1 = Customer(
            id="CUST-CI-001",
            first_name="Jean-Marc",
            last_name="KOFFI",
            gender="M",
            date_of_birth=date(1988, 5, 14),
            nationality="Ivoirienne",
            email="jeanmarc.koffi@gmail.com",
            address="Villa 142, Cité Horizon, Riviera Palmeraie",
            city="Abidjan",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            customer_since=date(2016, 3, 12)
        )
        db.add(c1)

        kyc1 = KycDocument(
            customer_id="CUST-CI-001",
            type="CNI",
            number="C01492049182",
            issued_date=date(2021, 2, 10),
            expiry_date=date(2031, 2, 10),
            issued_by="ONECI Côte d'Ivoire"
        )
        db.add(kyc1)

        t1 = CustomerTelecom(
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
        )
        db.add(t1)

        om1 = CustomerOrangeMoney(
            customer_id="CUST-CI-001",
            account_number="0708091011",
            status="ACTIF",
            kyc_level="Niveau 2 (Plafond 1 000 000 FCFA/j)",
            daily_limit=1000000,
            monthly_limit=5000000,
            current_balance=345800,
            savings_vault_balance=50000,
            currency="FCFA",
            is_pin_blocked=False,
            pin_hash=hash_pin("0000")
        )
        db.add(om1)

        # Transactions
        tx1 = OmTransaction(
            id="TX-CI-2608-9842",
            customer_id="CUST-CI-001",
            occurred_at=datetime(2026, 8, 26, 8, 30, tzinfo=timezone.utc),
            type="Transfert d'argent",
            label="Transfert vers 07 05 00 11 22 (Erreur numéro)",
            amount=25000,
            fee=250,
            currency="FCFA",
            sender_name="Jean-Marc KOFFI",
            sender_msisdn="0708091011",
            recipient_name="Kouakou Didier",
            recipient_msisdn="0705001122",
            status="EN_LITIGE",
            can_rollback=True
        )
        tx2 = OmTransaction(
            id="TX-CI-2508-8410",
            customer_id="CUST-CI-001",
            occurred_at=datetime(2026, 8, 25, 16, 45, tzinfo=timezone.utc),
            type="Paiement Facture",
            label="Règlement Facture Électricité CIE",
            amount=38200,
            fee=0,
            currency="FCFA",
            sender_name="Jean-Marc KOFFI",
            sender_msisdn="0708091011",
            recipient_name="CIE Énergie CI",
            recipient_msisdn="CIE_BILL",
            status="SUCCESS",
            can_rollback=False
        )
        db.add_all([tx1, tx2])

        # CDRs
        cdr1 = CdrRecord(
            id="CDR-01",
            customer_id="CUST-CI-001",
            occurred_at=datetime(2026, 8, 26, 8, 45, tzinfo=timezone.utc),
            type="APPEL_SORTANT",
            destination_or_origin="07 04 12 34 56 (Orange)",
            duration_or_volume="03m 42s",
            cost=150,
            currency="FCFA"
        )
        db.add(cdr1)

        # Ownership history
        own1 = SimOwnershipRecord(
            id="OWN-01",
            customer_id="CUST-CI-001",
            owner_name="Jean-Marc KOFFI",
            owner_id_document="CNI C01492049182",
            owner_phone_contact="07 08 09 10 11",
            period_start=date(2023, 3, 12),
            period_end=None,
            is_current=True,
            reason="Cession amiable de ligne",
            agency="Agence Cocody Angré",
            registered_by_agent="Roland KOFFI (AG-225-ABJ-042)",
            notes="Cession de ligne effectuée en agence avec pièces d'identité conformes."
        )
        own2 = SimOwnershipRecord(
            id="OWN-02",
            customer_id="CUST-CI-001",
            owner_name="Adjoua Marie BAMBA",
            owner_id_document="CNI C00891244019",
            owner_phone_contact="07 48 10 22 99",
            period_start=date(2019, 9, 15),
            period_end=date(2023, 3, 12),
            is_current=False,
            reason="Changement de ligne professionnelle",
            agency="Agence Plateau Siège",
            registered_by_agent="Mamadou Touré (AG-225-ABJ-008)",
            notes="Ancienne utilisatrice. Ligne cédée à M. Koffi."
        )
        db.add_all([own1, own2])

        # Audit logs
        log1 = AuditLogEntry(
            id="LOG-01",
            customer_id="CUST-CI-001",
            occurred_at=datetime(2026, 8, 26, 8, 31, tzinfo=timezone.utc),
            category="ORANGE_MONEY",
            action="Réclamation litige transfert erroné",
            details="Demande d'annulation enregistrée pour 25 000 FCFA vers 0705001122.",
            agent_id="AG-225-ABJ-042",
            agent_name="Roland KOFFI",
            agency_name="Agence Cocody Angré"
        )
        db.add(log1)

        # 4. Client 2 : Aminata TOURÉ (07 44 55 66 77 - eSIM)
        c2 = Customer(
            id="CUST-CI-002",
            first_name="Aminata",
            last_name="TOURÉ",
            gender="F",
            date_of_birth=date(1992, 11, 22),
            nationality="Ivoirienne",
            email="aminata.toure@orange.ci",
            address="Rue des Jardins, II Plateaux Vallon",
            city="Abidjan",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            customer_since=date(2021, 7, 18)
        )
        db.add(c2)

        kyc2 = KycDocument(
            customer_id="CUST-CI-002",
            type="PASSEPORT",
            number="19CI884921",
            issued_date=date(2022, 4, 5),
            expiry_date=date(2027, 4, 5),
            issued_by="Direction de la Surveillance du Territoire"
        )
        db.add(kyc2)

        t2 = CustomerTelecom(
            customer_id="CUST-CI-002",
            msisdn="07 44 55 66 77",
            raw_phone="0744556677",
            sim_iccid="89225 0200 7712 9031 4",
            imsi="612010771290314",
            network_type="4G+",
            offer_name="Orange Forfait Pro Business",
            line_status="ACTIVE",
            activation_date=date(2021, 7, 18),
            puk1="92817456",
            puk2="44102938",
            current_pin="0000",
            main_credit=45000,
            currency="FCFA",
            credit_validity="Illimité",
            data_remaining_mb=65000,
            data_total_mb=100000,
            data_expiry=date(2026, 9, 30),
            sms_remaining=2000,
            bonus_orange=15000
        )
        db.add(t2)

        om2 = CustomerOrangeMoney(
            customer_id="CUST-CI-002",
            account_number="0744556677",
            status="BLOQUE_CODE_ERRONE",
            kyc_level="Niveau 3 (Plafond 2 000 000 FCFA/j)",
            daily_limit=2000000,
            monthly_limit=10000000,
            current_balance=1250000,
            savings_vault_balance=300000,
            currency="FCFA",
            is_pin_blocked=True,
            failed_pin_attempts_count=3,
            freeze_reason="Code secret bloqué suite à 3 tentatives de mot de passe erronées consécutives",
            freeze_date=datetime(2026, 8, 26, 7, 45, tzinfo=timezone.utc),
            pin_hash=hash_pin("0000")
        )
        db.add(om2)

        own_t2 = SimOwnershipRecord(
            id="OWN-T01",
            customer_id="CUST-CI-002",
            owner_name="Aminata TOURÉ",
            owner_id_document="Passeport 19CI884921",
            owner_phone_contact="07 44 55 66 77",
            period_start=date(2021, 7, 18),
            period_end=None,
            is_current=True,
            reason="Attribution initiale",
            agency="Agence Marcory Zone 4",
            registered_by_agent="Serge Diop",
            notes="Titulaire unique."
        )
        db.add(own_t2)

        db.commit()
        print("Initialisation des données terminée avec succès !")
    except Exception as e:
        db.rollback()
        print("Erreur d'initialisation :", e)
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
