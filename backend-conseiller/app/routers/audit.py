from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.audit import AuditLogEntry
from app.schemas.audit import AuditLogEntryOut

router = APIRouter(prefix="/v1/customers/{customer_id}/audit-logs", tags=["audit"])

@router.get("", response_model=list[AuditLogEntryOut])
def list_audit_logs(
    customer_id: str,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(AuditLogEntry).filter(AuditLogEntry.customer_id == customer_id)
    if category:
        query = query.filter(AuditLogEntry.category == category)
    return query.order_by(AuditLogEntry.occurred_at.desc()).all()
