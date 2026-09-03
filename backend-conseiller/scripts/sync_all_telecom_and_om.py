import sys
import os
from datetime import date, datetime, timezone

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.base import Base, engine, SessionLocal
from app.core.security import hash_pin
from app.models.customer import Customer, CustomerTelecom, KycDocument, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry

def sync_telecom_and_om():
    print("🔄 Synchronisation et injection des numéros de téléphone et comptes OM...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    telecom_data = [
        {
            "customer_id": "CUST-CI-001",
            "msisdn": "07 08 09 10 11",
            "raw_phone": "0708091011",
            "sim_iccid": "89225 0100 4892 1042 1",
            "imsi": "612010489210421",
            "network_type": "4G+",
            "offer_name": "Formule Prépayé Orange Max 4G+",
            "line_status": "ACTIVE",
            "activation_date": date(2023, 3, 12),
            "puk1": "84920194",
            "puk2": "10492841",
            "current_pin": "0000",
            "main_credit": 14500,
            "currency": "FCFA",
            "credit_validity": "31/12/2026",
            "data_remaining_mb": 18840,
            "data_total_mb": 25600,
            "data_expiry": date(2026, 9, 15),
            "sms_remaining": 450,
            "bonus_orange": 5000,
            "om_balance": 345800,
            "om_vault": 50000,
            "om_status": "ACTIF",
            "om_kyc_level": "Niveau 2 (Plafond 5M)",
            "daily_limit": 1000000,
            "monthly_limit": 5000000,
        },
        {
            "customer_id": "CUST-CI-002",
            "msisdn": "07 44 55 66 77",
            "raw_phone": "0744556677",
            "sim_iccid": "89225 0200 7712 9031 4",
            "imsi": "612010771290314",
            "network_type": "4G+",
            "offer_name": "Orange Forfait Pro Business",
            "line_status": "ACTIVE",
            "activation_date": date(2021, 7, 18),
            "puk1": "92817456",
            "puk2": "44102938",
            "current_pin": "0000",
            "main_credit": 45000,
            "currency": "FCFA",
            "credit_validity": "Illimité",
            "data_remaining_mb": 65000,
            "data_total_mb": 100000,
            "data_expiry": date(2026, 9, 30),
            "sms_remaining": 2000,
            "bonus_orange": 15000,
            "om_balance": 1250000,
            "om_vault": 300000,
            "om_status": "BLOQUE_CODE_ERRONE",
            "om_kyc_level": "Niveau 3 (Plafond 10M)",
            "daily_limit": 2000000,
            "monthly_limit": 10000000,
        },
        {
            "customer_id": "CUST-CI-003",
            "msisdn": "07 01 23 45 67",
            "raw_phone": "0701234567",
            "sim_iccid": "89225 0300 1284 5910 2",
            "imsi": "612010128459102",
            "network_type": "4G",
            "offer_name": "Formule Prépayé Orange Classique",
            "line_status": "ACTIVE",
            "activation_date": date(2020, 5, 20),
            "puk1": "12345678",
            "puk2": "87654321",
            "current_pin": "0000",
            "main_credit": 8500,
            "currency": "FCFA",
            "credit_validity": "31/12/2026",
            "data_remaining_mb": 5200,
            "data_total_mb": 10000,
            "data_expiry": date(2026, 10, 15),
            "sms_remaining": 150,
            "bonus_orange": 2000,
            "om_balance": 85000,
            "om_vault": 10000,
            "om_status": "ACTIF",
            "om_kyc_level": "Niveau 1 (Plafond 1M)",
            "daily_limit": 500000,
            "monthly_limit": 2000000,
        },
        {
            "customer_id": "CUST-CI-004",
            "msisdn": "07 89 01 23 45",
            "raw_phone": "0789012345",
            "sim_iccid": "89225 0400 9941 2304 8",
            "imsi": "612010994123048",
            "network_type": "4G+",
            "offer_name": "Formule Prépayé Orange Passion 4G+",
            "line_status": "ACTIVE",
            "activation_date": date(2022, 11, 10),
            "puk1": "45678912",
            "puk2": "78912345",
            "current_pin": "0000",
            "main_credit": 21000,
            "currency": "FCFA",
            "credit_validity": "31/12/2026",
            "data_remaining_mb": 22000,
            "data_total_mb": 30000,
            "data_expiry": date(2026, 11, 1),
            "sms_remaining": 800,
            "bonus_orange": 7500,
            "om_balance": 210000,
            "om_vault": 40000,
            "om_status": "ACTIF",
            "om_kyc_level": "Niveau 2 (Plafond 5M)",
            "daily_limit": 1000000,
            "monthly_limit": 5000000,
        }
    ]

    try:
        for data in telecom_data:
            cust_id = data["customer_id"]
            
            # Vérifier si client existe
            cust = db.query(Customer).filter(Customer.id == cust_id).first()
            if not cust:
                print(f"⚠️ Client {cust_id} introuvable, création...")
                cust = Customer(
                    id=cust_id,
                    first_name="Client",
                    last_name="Orange",
                    gender="M",
                    date_of_birth=date(1990, 1, 1),
                    nationality="Ivoirienne",
                    customer_since=date(2020, 1, 1),
                )
                db.add(cust)
                db.flush()

            # 1. UPSERT CustomerTelecom
            tel = db.query(CustomerTelecom).filter(CustomerTelecom.customer_id == cust_id).first()
            if not tel:
                tel = CustomerTelecom(customer_id=cust_id, raw_phone=data["raw_phone"], msisdn=data["msisdn"])
                db.add(tel)
            
            tel.msisdn = data["msisdn"]
            tel.raw_phone = data["raw_phone"]
            tel.sim_iccid = data["sim_iccid"]
            tel.imsi = data["imsi"]
            tel.network_type = data["network_type"]
            tel.offer_name = data["offer_name"]
            tel.line_status = data["line_status"]
            tel.activation_date = data["activation_date"]
            tel.puk1 = data["puk1"]
            tel.puk2 = data["puk2"]
            tel.current_pin = data["current_pin"]
            tel.main_credit = data["main_credit"]
            tel.currency = data["currency"]
            tel.credit_validity = data["credit_validity"]
            tel.data_remaining_mb = data["data_remaining_mb"]
            tel.data_total_mb = data["data_total_mb"]
            tel.data_expiry = data["data_expiry"]
            tel.sms_remaining = data["sms_remaining"]
            tel.bonus_orange = data["bonus_orange"]

            # 2. UPSERT CustomerOrangeMoney
            om = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == cust_id).first()
            if not om:
                om = CustomerOrangeMoney(customer_id=cust_id, account_number=data["raw_phone"])
                db.add(om)

            om.account_number = data["raw_phone"]
            om.status = data["om_status"]
            om.kyc_level = data["om_kyc_level"]
            om.daily_limit = data["daily_limit"]
            om.monthly_limit = data["monthly_limit"]
            om.current_balance = data["om_balance"]
            om.savings_vault_balance = data["om_vault"]
            om.currency = "FCFA"
            om.is_pin_blocked = (data["om_status"] == "BLOQUE_CODE_ERRONE")
            om.pin_hash = hash_pin("0000")

            # 3. UPSERT SimOwnershipRecord
            own = db.query(SimOwnershipRecord).filter(SimOwnershipRecord.customer_id == cust_id).first()
            if not own:
                own = SimOwnershipRecord(
                    id=f"OWN-{cust_id}",
                    customer_id=cust_id,
                    owner_name=f"{cust.first_name} {cust.last_name}",
                    owner_id_document=f"CNI / Passeport de {cust.first_name}",
                    owner_phone_contact=data["msisdn"],
                    period_start=data["activation_date"],
                    period_end=None,
                    is_current=True,
                    reason="Attribution et enrôlement initial",
                    agency="Agence Orange Cocody Angré 8e Tranche",
                    registered_by_agent="Roland KOFFI (AG-225-ABJ-042)",
                    notes="Dossier vérifié et validé."
                )
                db.add(own)

            print(f"✅ Client {cust.first_name} {cust.last_name} ({cust_id}) associé au numéro : {data['msisdn']}")

        db.commit()
        print("\n🎉 TOUS LES 4 CLIENTS ONT ÉTÉ ASSOCIÉS À LEURS NUMÉROS AVEC SUCCÈS !\n")
    except Exception as e:
        db.rollback()
        print("❌ Erreur lors de l'injection :", e)
    finally:
        db.close()

if __name__ == "__main__":
    sync_telecom_and_om()
