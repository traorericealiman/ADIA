from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.orange_money import CustomerOrangeMoney
from app.schemas.orange_money import CustomerOrangeMoneyOut

router = APIRouter(prefix="/v1/customers/{customer_id}/orange-money", tags=["orange-money"])

@router.get("", response_model=CustomerOrangeMoneyOut)
def get_orange_money(customer_id: str, db: Session = Depends(get_db)):
    account = (
        db.query(CustomerOrangeMoney)
        .filter(CustomerOrangeMoney.customer_id == customer_id)
        .first()
    )
    if not account:
        raise HTTPException(status_code=404, detail="Compte Orange Money introuvable")
    return account
