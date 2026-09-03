from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.db.base import get_db
from app.models.customer import Customer, CustomerTelecom, CdrRecord
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.models.ownership import SimOwnershipRecord
from app.models.audit import AuditLogEntry
from app.models.ticket import SupportTicket
from app.schemas.customer import Customer360Profile, TitulaireActuelPuce
from app.db.seed import ensure_seed_data

router = APIRouter(prefix="/v1", tags=["customer"])

def _build_titulaire_actuel(customer: Customer) -> TitulaireActuelPuce:
    """Structure les informations spécifiques du Titulaire Actuel de la Puce."""
    genre = "Homme" if customer.gender == "M" else "Femme"
    msisdn = customer.telecom.msisdn if customer.telecom else "Non renseigné"
    raw_phone = customer.telecom.raw_phone if customer.telecom else ""
    line_status = customer.telecom.line_status if customer.telecom else "ACTIVE"

    return TitulaireActuelPuce(
        id=customer.id,
        nom=customer.last_name,
        prenoms=customer.first_name,
        nom_complet=f"{customer.first_name} {customer.last_name}",
        sexe=customer.gender,
        genre_label=genre,
        date_de_naissance=customer.date_of_birth,
        nationalite=customer.nationality,
        email=customer.email,
        adresse_residence=customer.address,
        ville=customer.city,
        client_depuis=customer.customer_since,
        photo_url=customer.avatar_url,
        msisdn=msisdn,
        raw_phone=raw_phone,
        statut_ligne=line_status,
        piece_identite=customer.kyc_document,
    )

def _build_full_360_profile(customer: Customer, db: Session) -> Customer360Profile:
    """Charge et structure toutes les données 360° du profil client."""
    # 1. Historique des consommations (CDR)
    cdr_records = (
        db.query(CdrRecord)
        .filter(CdrRecord.customer_id == customer.id)
        .order_by(CdrRecord.occurred_at.desc())
        .limit(20)
        .all()
    )
    if customer.telecom:
        setattr(customer.telecom, "cdr_history", cdr_records)

    # 2. Transactions Orange Money
    transactions = (
        db.query(OmTransaction)
        .filter(OmTransaction.customer_id == customer.id)
        .order_by(OmTransaction.occurred_at.desc())
        .limit(20)
        .all()
    )
    if customer.orange_money:
        setattr(customer.orange_money, "transactions", transactions)

    # 3. Historique de titularité
    ownership_history = (
        db.query(SimOwnershipRecord)
        .filter(SimOwnershipRecord.customer_id == customer.id)
        .order_by(SimOwnershipRecord.period_start.desc())
        .all()
    )

    # 4. Logs d'audit
    audit_logs = (
        db.query(AuditLogEntry)
        .filter(AuditLogEntry.customer_id == customer.id)
        .order_by(AuditLogEntry.occurred_at.desc())
        .limit(20)
        .all()
    )

    # 5. Tickets de support
    tickets = (
        db.query(SupportTicket)
        .filter(SupportTicket.customer_id == customer.id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )

    return Customer360Profile(
        id=customer.id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        gender=customer.gender,
        date_of_birth=customer.date_of_birth,
        nationality=customer.nationality,
        email=customer.email,
        address=customer.address,
        city=customer.city,
        avatar_url=customer.avatar_url,
        customer_since=customer.customer_since,
        kyc_document=customer.kyc_document,
        telecom=customer.telecom,
        orange_money=customer.orange_money,
        ownership_history=ownership_history,
        action_audit_logs=audit_logs,
        tickets=tickets,
    )

def _find_customer_by_phone(phone: str, db: Session) -> Customer:
    """Normalise le numéro et recherche le client dans la base."""
    raw = phone.strip()
    clean_digits = "".join(ch for ch in raw if ch.isdigit())
    last8 = clean_digits[-8:] if len(clean_digits) >= 8 else clean_digits
    phone_with_07 = f"07{last8}" if len(last8) == 8 else clean_digits

    # 1. Première tentative de recherche
    telecom = db.query(CustomerTelecom).filter(
        or_(
            CustomerTelecom.raw_phone == clean_digits,
            CustomerTelecom.raw_phone == phone_with_07,
            CustomerTelecom.raw_phone.like(f"%{last8}%"),
            CustomerTelecom.msisdn.like(f"%{last8}%"),
            CustomerTelecom.customer_id == raw
        )
    ).first()

    # 2. Si non trouvé, s'assurer que les données de test sont bien injectées et réessayer
    if not telecom:
        ensure_seed_data(db)
        telecom = db.query(CustomerTelecom).filter(
            or_(
                CustomerTelecom.raw_phone == clean_digits,
                CustomerTelecom.raw_phone == phone_with_07,
                CustomerTelecom.raw_phone.like(f"%{last8}%"),
                CustomerTelecom.msisdn.like(f"%{last8}%"),
                CustomerTelecom.customer_id == raw
            )
        ).first()

    if not telecom:
        # Recherche directe dans Customer
        customer = db.query(Customer).options(
            joinedload(Customer.kyc_document),
            joinedload(Customer.telecom),
            joinedload(Customer.orange_money)
        ).filter(
            or_(
                Customer.id == raw,
                Customer.id == f"CUST-CI-{clean_digits}"
            )
        ).first()

        if customer:
            return customer

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aucun client trouvé pour le numéro « {phone} » dans la base de données."
        )

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dossier client introuvable dans la base de données."
        )

    return customer

# ==============================================================================
# ENDPOINT DÉDIÉ : Titulaire Actuel de la Puce
# ==============================================================================

@router.get("/titulaire/{phone_number}", response_model=TitulaireActuelPuce, summary="Titulaire Actuel de la Puce (Path Param)")
@router.get("/customer/{phone_number}/titulaire", response_model=TitulaireActuelPuce, summary="Titulaire Actuel de la Puce (Sous-ressource)")
def get_titulaire_actuel(phone_number: str, db: Session = Depends(get_db)):
    customer = _find_customer_by_phone(phone_number, db)
    return _build_titulaire_actuel(customer)

@router.get("/titulaire", response_model=TitulaireActuelPuce, summary="Titulaire Actuel de la Puce (Query Param)")
def get_titulaire_actuel_by_query(
    msisdn: str = Query(..., description="Numéro de téléphone mobile du client (ex: 0708091011)"),
    db: Session = Depends(get_db)
):
    customer = _find_customer_by_phone(msisdn, db)
    return _build_titulaire_actuel(customer)

# ==============================================================================
# ENDPOINT COMPLET : Dossier Client 360°
# ==============================================================================

@router.get("/customer/{phone_number}", response_model=Customer360Profile, summary="Récupérer le profil 360° complet")
def get_customer_by_path_phone(phone_number: str, db: Session = Depends(get_db)):
    customer = _find_customer_by_phone(phone_number, db)
    return _build_full_360_profile(customer, db)

@router.get("/customer", response_model=Customer360Profile, summary="Récupérer le profil 360° par query parameter")
def get_customer_by_query_phone(
    msisdn: str = Query(..., description="Numéro de téléphone mobile du client"),
    db: Session = Depends(get_db)
):
    customer = _find_customer_by_phone(msisdn, db)
    return _build_full_360_profile(customer, db)
