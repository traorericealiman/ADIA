import sys
import os

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.base import SessionLocal
from app.models.customer import Customer, KycDocument, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.agency import Agency, Advisor

def display_all_data():
    db = SessionLocal()
    try:
        print("\n" + "="*85)
        print("          📱 LISTE DES CLIENTS ET DE LEURS NUMÉROS DE TÉLÉPHONE")
        print("="*85 + "\n")

        customers = db.query(Customer).all()
        print(f"👤 CLIENTS ENREGISTRÉS DANS LA BASE ({len(customers)}) :\n")

        for idx, c in enumerate(customers, 1):
            tel = db.query(CustomerTelecom).filter(CustomerTelecom.customer_id == c.id).first()
            kyc = db.query(KycDocument).filter(KycDocument.customer_id == c.id).first()
            om = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == c.id).first()

            num_affiche = tel.msisdn if tel else "Aucun numéro associé"
            raw_phone = tel.raw_phone if tel else "-"
            statut_ligne = tel.line_status if tel else "INACTIF"

            print(f"[{idx}] 👤 {c.first_name} {c.last_name} (ID: {c.id})")
            print(f"    📞 NUMÉRO DE TÉLÉPHONE : {num_affiche}  (Format brut : {raw_phone})")
            print(f"    📶 Statut de la ligne  : {statut_ligne} | Réseau : {tel.network_type if tel else '-'}")
            print(f"    🔑 Code PUK 1          : {tel.puk1 if tel else '-'} | Code PUK 2 : {tel.puk2 if tel else '-'}")
            print(f"    🎂 Né(e) le            : {c.date_of_birth} ({'Homme' if c.gender == 'M' else 'Femme'})")
            print(f"    📍 Adresse             : {c.address}, {c.city}")
            if kyc:
                print(f"    🪪 Pièce d'identité    : {kyc.type} {kyc.number} (Valide jusqu'au {kyc.expiry_date})")
            if om:
                print(f"    💰 Compte Orange Money : {om.account_number} | Statut : {om.status} | Solde : {om.current_balance} FCFA")
            print("-" * 85)

    except Exception as e:
        print(f"Erreur lors de la lecture : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    display_all_data()
