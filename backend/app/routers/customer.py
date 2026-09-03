from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.db.base import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerListItem, CustomerDetail
import uuid
from datetime import datetime, timezone
from app.core.security import hash_pin
from app.models.customer import KycDocument, CustomerTelecom
from app.models.orange_money import CustomerOrangeMoney
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.schemas.onboarding import CustomerOnboarding

router = APIRouter(prefix="/v1/customers", tags=["customers"])

@router.get("", response_model=list[CustomerListItem])
def search_customers(q: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Customer)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(Customer.first_name.ilike(like), Customer.last_name.ilike(like))
        )
    return query.limit(50).all()

@router.get("/by-phone/{phone_number}")
def get_customer_by_phone(phone_number: str, db: Session = Depends(get_db)):
    clean_digits = "".join(ch for ch in phone_number if ch.isdigit())
    telecom = db.query(CustomerTelecom).filter(
        or_(
            CustomerTelecom.raw_phone == clean_digits,
            CustomerTelecom.raw_phone == f"07{clean_digits[-8:]}" if len(clean_digits) >= 8 else False,
            CustomerTelecom.raw_phone.endswith(clean_digits[-8:]) if len(clean_digits) >= 8 else False,
            CustomerTelecom.msisdn.ilike(f"%{clean_digits}%")
        )
    ).first()
    if not telecom:
        raise HTTPException(status_code=404, detail=f"Aucun client trouvé pour le numéro « {phone_number} ».")
    customer = (
        db.query(Customer)
        .options(
            joinedload(Customer.kyc_document),
            joinedload(Customer.telecom),
            joinedload(Customer.orange_money)
        )
        .filter(Customer.id == telecom.customer_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Dossier client introuvable.")
    return customer

@router.get("/{customer_id}", response_model=CustomerDetail)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = (
        db.query(Customer)
        .options(joinedload(Customer.kyc_document), joinedload(Customer.orange_money))
        .filter(Customer.id == customer_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return customer

@router.post("", response_model=CustomerDetail, status_code=201)
def onboard_customer(payload: CustomerOnboarding, db: Session = Depends(get_db)):
    if db.query(Customer).filter(Customer.id == payload.id).first():
        raise HTTPException(status_code=409, detail="Cet identifiant client existe déjà")
    if db.query(CustomerTelecom).filter(CustomerTelecom.raw_phone == payload.telecom.raw_phone).first():
        raise HTTPException(status_code=409, detail="Ce numéro est déjà enregistré")

    today = datetime.now(timezone.utc)
    try:
        db.add(Customer(
            id=payload.id, first_name=payload.first_name, last_name=payload.last_name,
            gender=payload.gender, date_of_birth=payload.date_of_birth,
            nationality=payload.nationality, email=payload.email,
            address=payload.address, city=payload.city, customer_since=today.date(),
        ))
        db.add(KycDocument(customer_id=payload.id, **payload.kyc.model_dump()))
        db.add(CustomerTelecom(
            customer_id=payload.id, msisdn=payload.telecom.msisdn, raw_phone=payload.telecom.raw_phone,
            sim_iccid=payload.telecom.sim_iccid, imsi=payload.telecom.imsi,
            network_type=payload.telecom.network_type, offer_name=payload.telecom.offer_name,
            line_status="ACTIVE", activation_date=today.date(),
            puk1=payload.telecom.puk1, puk2=payload.telecom.puk2, current_pin=payload.telecom.sim_pin,
            main_credit=0, currency="FCFA", data_remaining_mb=0, data_total_mb=0,
            sms_remaining=0, bonus_orange=0,
        ))
        db.add(CustomerOrangeMoney(
            customer_id=payload.id, account_number=payload.telecom.raw_phone, status="ACTIF",
            kyc_level=payload.orange_money.kyc_level, daily_limit=payload.orange_money.daily_limit,
            monthly_limit=payload.orange_money.monthly_limit, current_balance=0, savings_vault_balance=0,
            currency="FCFA", is_pin_blocked=False, pin_hash=hash_pin(payload.orange_money.initial_pin),
        ))
        db.add(SimOwnershipRecord(
            id=f"OWN-{uuid.uuid4().hex[:8].upper()}", customer_id=payload.id,
            owner_name=f"{payload.first_name} {payload.last_name}",
            owner_id_document=f"{payload.kyc.type} {payload.kyc.number}",
            owner_phone_contact=payload.telecom.msisdn, period_start=today.date(),
            period_end=None, is_current=True, reason="Attribution initiale",
            agency=payload.agency_name, registered_by_agent=f"{payload.agent_name} ({payload.agent_id})",
            notes="Enrôlement conforme.",
        ))
        db.add(AuditLogEntry(
            id=f"LOG-{uuid.uuid4().hex[:8].upper()}", customer_id=payload.id, occurred_at=today,
            category="KYC_IDENTIFICATION", action="Enrôlement initial du client",
            details=f"Identification et création du compte pour {payload.first_name} {payload.last_name}.",
            agent_id=payload.agent_id, agent_name=payload.agent_name, agency_name=payload.agency_name,
        ))
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Échec de l'enrôlement, réessaie")

    return (
        db.query(Customer)
        .options(joinedload(Customer.kyc_document), joinedload(Customer.orange_money))
        .filter(Customer.id == payload.id)
        .first()
    )