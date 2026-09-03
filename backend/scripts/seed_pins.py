# backend/scripts/seed_pins.py
from app.db.base import SessionLocal
from app.core.security import hash_pin
from app.models.orange_money import CustomerOrangeMoney

DEFAULT_PIN = "0000"

db = SessionLocal()
accounts = db.query(CustomerOrangeMoney).all()
for account in accounts:
    if not account.pin_hash:
        account.pin_hash = hash_pin(DEFAULT_PIN)
db.commit()
db.close()
print(f"{len(accounts)} comptes mis à jour avec le PIN de test '{DEFAULT_PIN}'.")