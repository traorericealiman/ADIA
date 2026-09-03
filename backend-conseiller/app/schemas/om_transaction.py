from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class OmTransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    occurred_at: datetime
    type: str
    label: str
    amount: Decimal
    fee: Decimal
    currency: str
    sender_name: str
    sender_msisdn: str
    recipient_name: str
    recipient_msisdn: str
    status: str
    can_rollback: bool
    cancellation_reason: str | None

class TransactionCancelRequest(BaseModel):
    reason: str
    agent_id: str
    agent_name: str
    agency_name: str
