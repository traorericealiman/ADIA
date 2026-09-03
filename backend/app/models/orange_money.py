from sqlalchemy import Column, String, DateTime, Numeric, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class CustomerOrangeMoney(Base):
    __tablename__ = "customer_orange_money"
    customer_id = Column(String, ForeignKey("customers.id"), primary_key=True)
    account_number = Column(String, nullable=False, unique=True)
    status = Column(String, nullable=False)
    kyc_level = Column(String, nullable=False)
    daily_limit = Column(Numeric(14, 2), nullable=False)
    monthly_limit = Column(Numeric(14, 2), nullable=False)
    current_balance = Column(Numeric(14, 2), nullable=False, default=0)
    savings_vault_balance = Column(Numeric(14, 2), nullable=False, default=0)
    currency = Column(String, nullable=False, default="FCFA")
    is_pin_blocked = Column(Boolean, nullable=False, default=False)
    failed_pin_attempts_count = Column(Integer)
    freeze_reason = Column(String)
    freeze_date = Column(DateTime)
    pin_hash = Column(String)

    customer = relationship("Customer", back_populates="orange_money")


class OmTransaction(Base):
    __tablename__ = "om_transactions"
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    occurred_at = Column(DateTime, nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    amount = Column(Numeric(14, 2), nullable=False)
    fee = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String, nullable=False, default="FCFA")
    sender_name = Column(String, nullable=False)
    sender_msisdn = Column(String, nullable=False)
    recipient_name = Column(String, nullable=False)
    recipient_msisdn = Column(String, nullable=False)
    status = Column(String, nullable=False)
    can_rollback = Column(Boolean, nullable=False, default=False)
    cancellation_reason = Column(String)

