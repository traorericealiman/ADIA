from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.customer import CdrRecord
from app.schemas.cdr import CdrRecordOut

router = APIRouter(prefix="/v1/customers/{customer_id}/cdr", tags=["cdr"])

@router.get("", response_model=list[CdrRecordOut])
def list_cdr(
    customer_id: str,
    type: str | None = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(CdrRecord).filter(CdrRecord.customer_id == customer_id)
    if type:
        query = query.filter(CdrRecord.type == type)
    return query.order_by(CdrRecord.occurred_at.desc()).limit(limit).all()