from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.agency import Agency
from app.schemas.agency import AgencyOut

router = APIRouter(prefix="/v1/agencies", tags=["agencies"])

@router.get("", response_model=list[AgencyOut])
def list_agencies(city: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Agency)
    if city:
        query = query.filter(Agency.city.ilike(f"%{city}%"))
    return query.order_by(Agency.name).all()

@router.get("/{agency_id}", response_model=AgencyOut)
def get_agency(agency_id: str, db: Session = Depends(get_db)):
    agency = db.query(Agency).filter(Agency.id == agency_id).first()
    if not agency:
        raise HTTPException(status_code=404, detail="Agence introuvable")
    return agency