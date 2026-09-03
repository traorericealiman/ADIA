from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.customer import CustomerTelecom
from app.schemas.telecom import CustomerTelecomOut

router = APIRouter(prefix="/v1/customers/{customer_id}/telecom", tags=["telecom"])

@router.get("", response_model=CustomerTelecomOut)
def get_telecom(customer_id: str, db: Session = Depends(get_db)):
    telecom = db.query(CustomerTelecom).filter(CustomerTelecom.customer_id == customer_id).first()
    if not telecom:
        raise HTTPException(status_code=404, detail="Informations ligne introuvables")
    return telecom
