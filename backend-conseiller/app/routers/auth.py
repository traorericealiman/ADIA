from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.base import get_db
from app.models.customer import Customer, CustomerTelecom
from app.schemas.auth import CustomerLookupRequest, TokenResponse
from app.core.security import create_access_token

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/customer-session", response_model=TokenResponse)
@router.post("/token", response_model=TokenResponse)
def open_customer_session(payload: CustomerLookupRequest, db: Session = Depends(get_db)):
    """
    Connexion Conseiller au Profil Client :
    Demande UNIQUEMENT le numéro de téléphone (MSISDN).
    Aucun mot de passe / code PIN client n'est demandé au conseiller d'agence.
    """
    raw_phone = payload.msisdn.replace(" ", "").replace("-", "").replace(".", "").replace("+225", "")
    
    # Recherche par raw_phone ou msisdn
    telecom = db.query(CustomerTelecom).filter(
        or_(
            CustomerTelecom.raw_phone == raw_phone,
            CustomerTelecom.raw_phone == f"07{raw_phone[-8:]}" if len(raw_phone) >= 8 else False,
            CustomerTelecom.msisdn.ilike(f"%{raw_phone}%")
        )
    ).first()

    if not telecom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aucun client trouvé avec le numéro « {payload.msisdn} »."
        )

    customer = db.query(Customer).filter(Customer.id == telecom.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil client introuvable dans la base de données."
        )

    # Génération du token de session conseiller
    token = create_access_token({
        "sub": customer.id,
        "msisdn": telecom.msisdn,
        "raw_phone": telecom.raw_phone,
        "role": "ADVISOR_SESSION"
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        customer_id=customer.id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        msisdn=telecom.msisdn
    )
