from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.orange_money import OmTransaction
from app.schemas.om_transaction import OmTransactionOut
import uuid
from datetime import datetime, timezone
from app.models.orange_money import CustomerOrangeMoney
from app.models.audit import AuditLogEntry
from app.schemas.om_transaction import TransactionCancelRequest

router = APIRouter(prefix="/v1/customers/{customer_id}/orange-money/transactions", tags=["orange-money"])

@router.get("", response_model=list[OmTransactionOut])
def list_om_transactions(
    customer_id: str,
    status: str | None = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(OmTransaction).filter(OmTransaction.customer_id == customer_id)
    if status:
        query = query.filter(OmTransaction.status == status)
    return query.order_by(OmTransaction.occurred_at.desc()).limit(limit).all()

@router.post("/{transaction_id}/cancel", response_model=OmTransactionOut)
def cancel_transaction(
    customer_id: str, transaction_id: str, payload: TransactionCancelRequest, db: Session = Depends(get_db)
):
    tx = (
        db.query(OmTransaction)
        .filter(OmTransaction.id == transaction_id, OmTransaction.customer_id == customer_id)
        .first()
    )
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    if not tx.can_rollback:
        raise HTTPException(status_code=400, detail="Cette transaction n'est pas annulable")
    if tx.status == "ANNULEE":
        raise HTTPException(status_code=400, detail="Cette transaction est déjà annulée")

    account = db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == customer_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Compte Orange Money introuvable")

    account.current_balance += (tx.amount + tx.fee)
    tx.status = "ANNULEE"
    tx.can_rollback = False
    tx.cancellation_reason = payload.reason

    db.add(AuditLogEntry(
        id=f"LOG-{uuid.uuid4().hex[:8].upper()}", customer_id=customer_id,
        occurred_at=datetime.now(timezone.utc), category="ORANGE_MONEY",
        action="Annulation de transaction", details=payload.reason,
        agent_id=payload.agent_id, agent_name=payload.agent_name, agency_name=payload.agency_name,
    ))

    db.commit()
    db.refresh(tx)
    return tx