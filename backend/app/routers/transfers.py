import uuid
from datetime import datetime, timezone
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.base import get_db
from app.core.deps import get_current_customer
from app.core.security import verify_pin
from app.models.customer import Customer, CustomerTelecom
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.schemas.transfer import TransferRequest, TransferResult

router = APIRouter(prefix="/v1/me/orange-money/transfers", tags=["orange-money"])


def _gen_tx_id() -> str:
    return f"TX-CI-{datetime.now(timezone.utc).strftime('%y%m')}-{uuid.uuid4().hex[:6].upper()}"


# Barème simplifié — placeholder à ajuster si tu as le vrai barème Orange Money
FEE_BRACKETS = [
    (Decimal(5000), Decimal(100)),
    (Decimal(25000), Decimal(250)),
    (Decimal(50000), Decimal(500)),
    (Decimal(100000), Decimal(1000)),
    (Decimal(250000), Decimal(2000)),
    (Decimal(500000), Decimal(3500)),
    (Decimal(1000000), Decimal(5000)),
]

def compute_fee(amount: Decimal) -> Decimal:
    for ceiling, fee in FEE_BRACKETS:
        if amount <= ceiling:
            return fee
    return FEE_BRACKETS[-1][1]


@router.post("", response_model=TransferResult, status_code=status.HTTP_201_CREATED)
def create_transfer(
    payload: TransferRequest,
    current: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    sender_account = (
        db.query(CustomerOrangeMoney)
        .filter(CustomerOrangeMoney.customer_id == current.id)
        .first()
    )
    if not sender_account:
        raise HTTPException(status_code=404, detail="Compte Orange Money introuvable")

    if sender_account.is_pin_blocked or sender_account.status != "ACTIF":
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=sender_account.freeze_reason or "Compte bloqué, transfert impossible",
        )

    if not verify_pin(payload.pin, sender_account.pin_hash or ""):
        raise HTTPException(status_code=401, detail="Code secret incorrect")

    fee = compute_fee(payload.amount)
    total_debit = payload.amount + fee

    if sender_account.current_balance < total_debit:
        raise HTTPException(status_code=400, detail="Solde insuffisant")

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    spent_today = (
        db.query(func.coalesce(func.sum(OmTransaction.amount), 0))
        .filter(
            OmTransaction.customer_id == current.id,
            OmTransaction.occurred_at >= today_start,
            OmTransaction.status == "SUCCESS",
        )
        .scalar()
    )
    if spent_today + payload.amount > sender_account.daily_limit:
        raise HTTPException(status_code=400, detail="Plafond journalier dépassé")

    recipient_phone = payload.recipient_msisdn.replace(" ", "")
    recipient_telecom = (
        db.query(CustomerTelecom).filter(CustomerTelecom.raw_phone == recipient_phone).first()
    )
    recipient_customer = None
    recipient_account = None
    if recipient_telecom:
        recipient_customer = db.query(Customer).filter(Customer.id == recipient_telecom.customer_id).first()
        recipient_account = (
            db.query(CustomerOrangeMoney)
            .filter(CustomerOrangeMoney.customer_id == recipient_telecom.customer_id)
            .first()
        )

    recipient_name = (
        f"{recipient_customer.first_name} {recipient_customer.last_name}"
        if recipient_customer else recipient_phone
    )

    try:
        now = datetime.now(timezone.utc)
        sender_tx = OmTransaction(
            id=_gen_tx_id(),
            customer_id=current.id,
            occurred_at=now,
            type="Transfert d'argent",
            label=payload.label or f"Transfert vers {recipient_phone}",
            amount=payload.amount,
            fee=fee,
            currency="FCFA",
            sender_name=f"{current.first_name} {current.last_name}",
            sender_msisdn=sender_account.account_number,
            recipient_name=recipient_name,
            recipient_msisdn=recipient_phone,
            status="SUCCESS",
            can_rollback=True,
        )
        sender_account.current_balance -= total_debit
        db.add(sender_tx)

        if recipient_account and recipient_customer:
            recipient_tx = OmTransaction(
                id=_gen_tx_id(),
                customer_id=recipient_customer.id,
                occurred_at=now,
                type="Transfert d'argent",
                label=f"Réception de {current.first_name} {current.last_name}",
                amount=payload.amount,
                fee=Decimal(0),
                currency="FCFA",
                sender_name=f"{current.first_name} {current.last_name}",
                sender_msisdn=sender_account.account_number,
                recipient_name=f"{recipient_customer.first_name} {recipient_customer.last_name}",
                recipient_msisdn=recipient_phone,
                status="SUCCESS",
                can_rollback=False,
            )
            recipient_account.current_balance += payload.amount
            db.add(recipient_tx)

        db.commit()
        db.refresh(sender_tx)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Le transfert a échoué, réessaie")

    return TransferResult(transaction=sender_tx, new_balance=sender_account.current_balance)