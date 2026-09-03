import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.customer import CustomerTelecom
from app.models.orange_money import CustomerOrangeMoney
from app.models.audit import AuditLogEntry
from app.schemas.auth import TokenRequest, TokenResponse
from app.core.security import verify_pin, create_access_token

router = APIRouter(prefix="/v1/auth", tags=["auth"])
MAX_ATTEMPTS = 3

@router.post("/token", response_model=TokenResponse)
def login(payload: TokenRequest, db: Session = Depends(get_db)):
    raw_phone = payload.msisdn.replace(" ", "")
    telecom = db.query(CustomerTelecom).filter(CustomerTelecom.raw_phone == raw_phone).first()
    if not telecom:
        raise HTTPException(status_code=401, detail="Numéro ou code secret incorrect")

    account = db.query(CustomerOrangeMoney).filter(
        CustomerOrangeMoney.customer_id == telecom.customer_id
    ).first()
    if not account:
        raise HTTPException(status_code=401, detail="Numéro ou code secret incorrect")

    if account.is_pin_blocked:
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=account.freeze_reason or "Compte bloqué",
        )

    if not account.pin_hash or not verify_pin(payload.pin, account.pin_hash):
        account.failed_pin_attempts_count = (account.failed_pin_attempts_count or 0) + 1
        if account.failed_pin_attempts_count >= MAX_ATTEMPTS:
            account.is_pin_blocked = True
            account.status = "BLOQUE_CODE_ERRONE"
            account.freeze_reason = (
                f"Code secret bloqué suite à {MAX_ATTEMPTS} tentatives de mot de passe erronées consécutives"
            )
            account.freeze_date = datetime.now(timezone.utc)
            db.add(AuditLogEntry(
                id=f"LOG-{uuid.uuid4().hex[:8].upper()}",
                customer_id=telecom.customer_id,
                occurred_at=datetime.now(timezone.utc),
                category="SECURITE",
                action="Blocage automatique code secret OM",
                details=f"{MAX_ATTEMPTS} tentatives erronées. Déblocage requis en agence.",
                agent_id="SYS-OM",
                agent_name="Serveur Sécurité OM",
                agency_name="Plateforme Orange Money",
            ))
        db.commit()
        raise HTTPException(status_code=401, detail="Numéro ou code secret incorrect")

    account.failed_pin_attempts_count = 0
    db.commit()

    token = create_access_token({"sub": telecom.customer_id})
    return TokenResponse(access_token=token)