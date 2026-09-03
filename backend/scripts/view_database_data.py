import sys
import os

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.base import SessionLocal
from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.models.agency import Agency, Advisor
from app.models.ticket import SupportTicket

def display_all_data():
    db = SessionLocal()
    try:
        print("\n" + "="*80)
        print("          📊 CONTENU COMPLET DE LA BASE DE DONNÉES POSTGRESQL")
        print("="*80 + "\n")

        # 1. CLIENTS & TITULAIRES
        customers = db.query(Customer).all()
        print(f"👤 CLIENTS ENREGISTRÉS ({len(customers)}) :")
        print("-" * 80)
        for c in customers:
            kyc = c.kyc_document
            tel = c.telecom
            om = c.orange_money
            print(f"• ID: {c.id} | Nom: {c.first_name} {c.last_name} | Genre: {c.gender} | Né(e) le: {c.date_of_birth} | Nationalité: {c.nationality}")
            print(f"  📍 Adresse: {c.address}, {c.city} | Email: {c.email} | Client depuis: {c.customer_since}")
            if kyc:
                print(f"  🪪 Pièce: {kyc.type} N° {kyc.number} (Délivrée le {kyc.issued_date}, Expire le {kyc.expiry_date} par {kyc.issued_by})")
            if tel:
                print(f"  📱 Ligne: {tel.msisdn} (Raw: {tel.raw_phone}) | Statut: {tel.line_status} | Réseau: {tel.network_type} | PUK1: {tel.puk1} | PUK2: {tel.puk2}")
                print(f"     Solde: {tel.main_credit} {tel.currency} | Data: {tel.data_remaining_mb} Mo / {tel.data_total_mb} Mo | SMS: {tel.sms_remaining}")
            if om:
                print(f"  💰 Orange Money: N° {om.account_number} | Statut: {om.status} | Niveau: {om.kyc_level}")
                print(f"     Solde: {om.current_balance} {om.currency} | Coffre-fort: {om.savings_vault_balance} {om.currency} | Plafond Jour: {om.daily_limit}")
            print()

        # 2. HISTORIQUE DE PROPRIÉTÉ
        ownerships = db.query(SimOwnershipRecord).all()
        print(f"\n📑 HISTORIQUE DE TITULARITÉ SIM ({len(ownerships)}) :")
        print("-" * 80)
        for o in ownerships:
            status = "ACTUEL" if o.is_current else f"Jusqu'au {o.period_end}"
            print(f"• ID: {o.id} | Client: {o.customer_id} | Titulaire: {o.owner_name} ({o.owner_id_document})")
            print(f"  Période: {o.period_start} -> {status} | Motif: {o.reason} | Agence: {o.agency}")
            print()

        # 3. AGENCES & CONSEILLERS
        agencies = db.query(Agency).all()
        print(f"\n🏢 AGENCES ORANGE CI ({len(agencies)}) :")
        print("-" * 80)
        for a in agencies:
            print(f"• ID: {a.id} | {a.name} ({a.city}) | Adresse: {a.address} | Tél: {a.phone} | Manager: {a.manager}")
        
        advisors = db.query(Advisor).all()
        print(f"\n👔 CONSEILLERS D'AGENCE ({len(advisors)}) :")
        print("-" * 80)
        for adv in advisors:
            print(f"• ID: {adv.id} | {adv.name} ({adv.role}) | Email: {adv.email} | Guichet: {adv.counter_number} | Agence ID: {adv.agency_id}")

        print("\n" + "="*80 + "\n")

    except Exception as e:
        print(f"Erreur lors de la lecture de la base de données: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    display_all_data()
