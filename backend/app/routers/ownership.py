from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.ownership import SimOwnershipRecord
from app.schemas.ownership import SimOwnershipRecordOut
import uuid
from datetime import date, datetime, timezone
from app.models.customer import Customer, KycDocument
from app.models.audit import AuditLogEntry
from app.schemas.ownership import OwnershipTransferRequest

router = APIRouter(prefix="/v1/customers/{customer_id}/ownership-history", tags=["ownership"])

@router.get("", response_model=list[SimOwnershipRecordOut])
def list_ownership_history(customer_id: str, db: Session = Depends(get_db)):
    return (
        db.query(SimOwnershipRecord)
        .filter(SimOwnershipRecord.customer_id == customer_id)
        .order_by(SimOwnershipRecord.period_start.desc())
        .all()
    )

@router.post("/transfer", response_model=SimOwnershipRecordOut, status_code=201)
def transfer_ownership(customer_id: str, payload: OwnershipTransferRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Client introuvable")

    current_record = (
        db.query(SimOwnershipRecord)
        .filter(SimOwnershipRecord.customer_id == customer_id, SimOwnershipRecord.is_current == True)
        .first()
    )
    today = date.today()
    if current_record:
        current_record.period_end = today
        current_record.is_current = False

    new_record = SimOwnershipRecord(
        id=f"OWN-{uuid.uuid4().hex[:8].upper()}", customer_id=customer_id,
        owner_name=payload.new_owner_name, owner_id_document=payload.new_owner_id_document,
        owner_phone_contact=payload.new_owner_phone_contact, period_start=today,
        period_end=None, is_current=True, reason=payload.reason,
        agency=payload.agency_name, registered_by_agent=f"{payload.agent_name} ({payload.agent_id})",
        notes=f"Cession de ligne effectuée en agence — {payload.reason}.",
    )
    db.add(new_record)

    first_name, *rest = payload.new_owner_name.split(" ", 1)
    customer.first_name = first_name
    customer.last_name = rest[0] if rest else ""

    kyc = db.query(KycDocument).filter(KycDocument.customer_id == customer_id).first()
    if kyc:
        kyc.type = payload.new_kyc.type
        kyc.number = payload.new_kyc.number
        kyc.issued_date = payload.new_kyc.issued_date
        kyc.expiry_date = payload.new_kyc.expiry_date
        kyc.issued_by = payload.new_kyc.issued_by

    db.add(AuditLogEntry(
        id=f"LOG-{uuid.uuid4().hex[:8].upper()}", customer_id=customer_id,
        occurred_at=datetime.now(timezone.utc), category="KYC_IDENTIFICATION",
        action="Cession et changement de titulaire",
        details=f"Changement de propriétaire vers {payload.new_owner_name}.",
        agent_id=payload.agent_id, agent_name=payload.agent_name, agency_name=payload.agency_name,
    ))

    db.commit()
    db.refresh(new_record)
    return new_record