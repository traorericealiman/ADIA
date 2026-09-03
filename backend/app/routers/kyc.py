from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.customer import KycDocument
from app.schemas.kyc import KycDocumentOut, KycDocumentUpdate

router = APIRouter(prefix="/v1/customers/{customer_id}/kyc", tags=["kyc"])

@router.get("", response_model=KycDocumentOut)
def get_kyc(customer_id: str, db: Session = Depends(get_db)):
    kyc = db.query(KycDocument).filter(KycDocument.customer_id == customer_id).first()
    if not kyc:
        raise HTTPException(status_code=404, detail="Document KYC introuvable")
    return kyc

@router.put("", response_model=KycDocumentOut)
def update_kyc(customer_id: str, payload: KycDocumentUpdate, db: Session = Depends(get_db)):
    kyc = db.query(KycDocument).filter(KycDocument.customer_id == customer_id).first()
    if not kyc:
        raise HTTPException(status_code=404, detail="Document KYC introuvable")
    for field, value in payload.model_dump().items():
        setattr(kyc, field, value)
    db.commit()
    db.refresh(kyc)
    return kyc