from sqlalchemy import Column, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class SimOwnershipRecord(Base):
    __tablename__ = "sim_ownership_records"
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    owner_name = Column(String, nullable=False)
    owner_id_document = Column(String, nullable=False)
    owner_phone_contact = Column(String, nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date)
    is_current = Column(Boolean, nullable=False, default=False)
    reason = Column(String, nullable=False)
    agency = Column(String, nullable=False)
    registered_by_agent = Column(String, nullable=False)
    notes = Column(String)

    customer = relationship("Customer", back_populates="ownership_history")