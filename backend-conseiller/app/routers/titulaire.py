from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.db.base import get_db
from app.models.customer import Customer, CustomerTelecom, KycDocument
from app.schemas.titulaire import TitulaireActuelResponse, PieceIdentiteDetail
from app.db.seed import ensure_seed_data

router = APIRouter(prefix="/v1", tags=["titulaire"])

def _format_titulaire_response(customer: Customer, telecom: CustomerTelecom) -> TitulaireActuelResponse:
    """Formate exactement les informations de la carte Titulaire Actuel de la Puce."""
    genre_libelle = "Homme" if customer.gender == "M" else "Femme"
    
    # Formatage date de naissance
    dob = customer.date_of_birth
    date_naissance_texte = f"{dob.strftime('%d/%m/%Y')} ({genre_libelle})" if dob else ""

    # Formatage client depuis
    cs = customer.customer_since
    client_depuis_texte = cs.strftime('%d/%m/%Y') if cs else ""

    # Pièce d'identité
    kyc = customer.kyc_document
    if kyc:
        piece = PieceIdentiteDetail(
            type=kyc.type,
            numero=kyc.number,
            date_delivrance=kyc.issued_date,
            date_expiration=kyc.expiry_date,
            emetteur=kyc.issued_by,
            affichage_complet=f"{kyc.type} {kyc.number}"
        )
    else:
        piece = PieceIdentiteDetail(
            type="CNI",
            numero="Non renseigné",
            affichage_complet="Non renseigné"
        )

    return TitulaireActuelResponse(
        customer_id=customer.id,
        numero_telephone=telecom.msisdn if telecom else "Non renseigné",
        raw_phone=telecom.raw_phone if telecom else "",
        statut_ligne=telecom.line_status if telecom else "ACTIVE",
        nom=customer.last_name,
        prenoms=customer.first_name,
        nom_complet=f"{customer.first_name} {customer.last_name}",
        genre=customer.gender,
        genre_libelle=genre_libelle,
        date_naissance=customer.date_of_birth,
        date_naissance_texte=date_naissance_texte,
        nationalite=customer.nationality,
        piece_identite=piece,
        adresse_residence=customer.address or "",
        ville=customer.city or "Abidjan",
        email=customer.email,
        client_depuis=customer.customer_since,
        client_depuis_texte=client_depuis_texte,
        photo_url=customer.avatar_url
    )

def _get_customer_by_phone_number(phone: str, db: Session) -> tuple[Customer, CustomerTelecom]:
    raw = phone.strip()
    clean_digits = "".join(ch for ch in raw if ch.isdigit())
    last8 = clean_digits[-8:] if len(clean_digits) >= 8 else clean_digits
    phone_with_07 = f"07{last8}" if len(last8) == 8 else clean_digits

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aucun titulaire trouvé pour le numéro « {phone} »."
        )

    customer = (
        db.query(Customer)
        .options(joinedload(Customer.kyc_document), joinedload(Customer.telecom))
        .filter(Customer.id == telecom.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dossier client introuvable dans la base de données."
        )

    return customer, telecom

@router.get("/titulaire/{phone_number}", response_model=TitulaireActuelResponse, summary="Obtenir les infos du Titulaire Actuel de la Puce")
def get_titulaire_actuel_by_phone(phone_number: str, db: Session = Depends(get_db)):
    customer, telecom = _get_customer_by_phone_number(phone_number, db)
    return _format_titulaire_response(customer, telecom)

@router.get("/titulaire", response_model=TitulaireActuelResponse, summary="Obtenir les infos du Titulaire Actuel par query param")
def get_titulaire_actuel_query(
    msisdn: str = Query(..., description="Numéro de téléphone mobile (ex: 0708091011 ou 07 08 09 10 11)"),
    db: Session = Depends(get_db)
):
    customer, telecom = _get_customer_by_phone_number(msisdn, db)
    return _format_titulaire_response(customer, telecom)
