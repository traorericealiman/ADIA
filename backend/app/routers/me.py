from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.db.base import get_db
from app.core.deps import get_current_customer
from app.models.customer import Customer, CustomerTelecom
from app.models.orange_money import CustomerOrangeMoney, OmTransaction
from app.schemas.customer import CustomerDetail
from app.schemas.telecom import CustomerTelecomOut
from app.schemas.orange_money import CustomerOrangeMoneyOut
from app.schemas.om_transaction import OmTransactionOut

router = APIRouter(prefix="/v1/me", tags=["me"])

@router.get("", response_model=CustomerDetail)
def read_my_profile(current: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    return (
        db.query(Customer)
        .options(joinedload(Customer.kyc_document), joinedload(Customer.orange_money))
        .filter(Customer.id == current.id)
        .first()
    )

@router.get("/telecom", response_model=CustomerTelecomOut)
def read_my_telecom(current: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    return db.query(CustomerTelecom).filter(CustomerTelecom.customer_id == current.id).first()

@router.get("/orange-money", response_model=CustomerOrangeMoneyOut)
def read_my_orange_money(current: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    return db.query(CustomerOrangeMoney).filter(CustomerOrangeMoney.customer_id == current.id).first()

@router.get("/orange-money/transactions", response_model=list[OmTransactionOut])
def read_my_transactions(current: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    return (
        db.query(OmTransaction)
        .filter(OmTransaction.customer_id == current.id)
        .order_by(OmTransaction.occurred_at.desc())
        .all()
    )