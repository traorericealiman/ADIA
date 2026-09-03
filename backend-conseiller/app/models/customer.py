from sqlalchemy import Column, String, Date, DateTime, Numeric, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    gender = Column(String(1), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    nationality = Column(String, nullable=False)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    avatar_url = Column(String)
    customer_since = Column(Date, nullable=False)

    kyc_document = relationship("KycDocument", uselist=False, back_populates="customer")
    telecom = relationship("CustomerTelecom", uselist=False, back_populates="customer")
    orange_money = relationship("CustomerOrangeMoney", uselist=False, back_populates="customer")
    ownership_history = relationship("SimOwnershipRecord", back_populates="customer")
    audit_logs = relationship("AuditLogEntry", back_populates="customer")
    tickets = relationship("SupportTicket", back_populates="customer")


class KycDocument(Base):
    __tablename__ = "kyc_documents"
    customer_id = Column(String, ForeignKey("customers.id"), primary_key=True)
    type = Column(String, nullable=False)
    number = Column(String, nullable=False)
    issued_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    issued_by = Column(String, nullable=False)

    customer = relationship("Customer", back_populates="kyc_document")


class CustomerTelecom(Base):
    __tablename__ = "customer_telecom"
    customer_id = Column(String, ForeignKey("customers.id"), primary_key=True)
    msisdn = Column(String, nullable=False)
    raw_phone = Column(String, nullable=False, unique=True)
    sim_iccid = Column(String, nullable=False)
    imsi = Column(String, nullable=False)
    network_type = Column(String, nullable=False)
    offer_name = Column(String, nullable=False)
    line_status = Column(String, nullable=False)
    status_reason = Column(String)
    activation_date = Column(Date, nullable=False)
    puk1 = Column(String, nullable=False)
    puk2 = Column(String, nullable=False)
    current_pin = Column(String, nullable=False)
    main_credit = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String, nullable=False, default="FCFA")
    credit_validity = Column(String)
    data_remaining_mb = Column(Integer, nullable=False, default=0)
    data_total_mb = Column(Integer, nullable=False, default=0)
    data_expiry = Column(Date)
    sms_remaining = Column(Integer, nullable=False, default=0)
    bonus_orange = Column(Numeric(12, 2), nullable=False, default=0)

    customer = relationship("Customer", back_populates="telecom")


class CdrRecord(Base):
    __tablename__ = "cdr_records"
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    occurred_at = Column(DateTime, nullable=False)
    type = Column(String, nullable=False)
    destination_or_origin = Column(String, nullable=False)
    duration_or_volume = Column(String, nullable=False)
    cost = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String, nullable=False, default="FCFA")
