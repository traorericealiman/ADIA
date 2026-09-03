from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.db.base import get_db
from app.models.agency import Advisor
from app.schemas.advisor import AdvisorOut

router = APIRouter(prefix="/v1/advisors", tags=["advisors"])

@router.get("", response_model=list[AdvisorOut])
def list_advisors(agency_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Advisor).options(joinedload(Advisor.agency))
    if agency_id:
        query = query.filter(Advisor.agency_id == agency_id)
    return query.all()

@router.get("/{advisor_id}", response_model=AdvisorOut)
def get_advisor(advisor_id: str, db: Session = Depends(get_db)):
    advisor = (
        db.query(Advisor)
        .options(joinedload(Advisor.agency))
        .filter(Advisor.id == advisor_id)
        .first()
    )
    if not advisor:
        raise HTTPException(status_code=404, detail="Conseiller introuvable")
    return advisor