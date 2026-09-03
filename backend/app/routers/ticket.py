from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.ticket import SupportTicket
from app.schemas.ticket import SupportTicketOut, SupportTicketCreate, SupportTicketStatusUpdate

router = APIRouter(prefix="/v1/customers/{customer_id}/tickets", tags=["tickets"])

@router.get("", response_model=list[SupportTicketOut])
def list_tickets(customer_id: str, db: Session = Depends(get_db)):
    return (
        db.query(SupportTicket)
        .filter(SupportTicket.customer_id == customer_id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )

@router.post("", response_model=SupportTicketOut, status_code=201)
def create_ticket(customer_id: str, payload: SupportTicketCreate, db: Session = Depends(get_db)):
    ticket = SupportTicket(
        customer_id=customer_id,
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(exclude={"status"}),
        status=payload.status,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.patch("/{ticket_id}/status", response_model=SupportTicketOut)
def update_ticket_status(
    customer_id: str, ticket_id: str, payload: SupportTicketStatusUpdate, db: Session = Depends(get_db)
):
    ticket = (
        db.query(SupportTicket)
        .filter(SupportTicket.id == ticket_id, SupportTicket.customer_id == customer_id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket introuvable")
    ticket.status = payload.status
    db.commit()
    db.refresh(ticket)
    return ticket