import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.orange_money import CustomerOrangeMoney
from app.models.audit import AuditLogEntry
from app.core.security import hash_pin
from app.schemas.orange_money_action import UnblockRequest, FreezeRequest, UnfreezeRequest
from app.schemas.orange_money import CustomerOrangeMoneyOut

router = APIRouter(prefix="/v1/customers/{customer_id}/orange-money", tags=["orange-money-actions"])


def _get_account(db: Session, customer_id: str) -> CustomerOrangeMoney:
    account = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == customer_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Compte Orange Money introuvable")
    return account


def _log(db: Session, customer_id: str, category: str, action: str, details: str, ctx):
    db.add(AuditLogEntry(
        id=f"LOG-{uuid.uuid4().hex[:8].upper()}",
        customer_id=customer_id,
        occurred_at=datetime.now(timezone.utc),
        category=category,
        action=action,
        details=details,
        agent_id=ctx.agent_id,
        agent_name=ctx.agent_name,
        agency_name=ctx.agency_name,
    ))


@router.post("/unblock", response_model=CustomerOrangeMoneyOut)
def unblock_account(customer_id: str, payload: UnblockRequest, db: Session = Depends(get_db)):
    account = _get_account(db, customer_id)
    if not account.is_pin_blocked:
        raise HTTPException(status_code=400, detail="Ce compte n'est pas bloqué")

    account.is_pin_blocked = False
    account.status = "ACTIF"
    account.failed_pin_attempts_count = 0
    account.freeze_reason = None
    account.freeze_date = None
    account.pin_hash = hash_pin(payload.new_pin)

    _log(db, customer_id, "ORANGE_MONEY", "Déblocage du compte (nouveau code secret défini)",
         "Compte débloqué en agence, nouveau code secret défini par le client.", payload)
    db.commit()
    db.refresh(account)
    return account


@router.post("/freeze", response_model=CustomerOrangeMoneyOut)
def freeze_account(customer_id: str, payload: FreezeRequest, db: Session = Depends(get_db)):
    account = _get_account(db, customer_id)
    if account.status == "GELE_FRAUDE":
        raise HTTPException(status_code=400, detail="Ce compte est déjà gelé")

    account.status = "GELE_FRAUDE"
    account.freeze_reason = payload.reason
    account.freeze_date = datetime.now(timezone.utc)

    _log(db, customer_id, "SECURITE", "Gel de sécurité du compte", payload.reason, payload)
    db.commit()
    db.refresh(account)
    return account


@router.post("/unfreeze", response_model=CustomerOrangeMoneyOut)
def unfreeze_account(customer_id: str, payload: UnfreezeRequest, db: Session = Depends(get_db)):
    account = _get_account(db, customer_id)
    if account.status != "GELE_FRAUDE":
        raise HTTPException(status_code=400, detail="Ce compte n'est pas gelé")

    account.status = "ACTIF"
    account.freeze_reason = None
    account.freeze_date = None

    _log(db, customer_id, "SECURITE", "Dégel du compte",
         payload.note or "Compte dégelé après vérification.", payload)
    db.commit()
    db.refresh(account)
    return account