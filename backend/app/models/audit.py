from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class AuditLogEntry(Base):
    __tablename__ = "audit_log_entries"
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    occurred_at = Column(DateTime, nullable=False)
    category = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(String, nullable=False)
    agent_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    agency_name = Column(String, nullable=False)

    customer = relationship("Customer", back_populates="audit_logs")