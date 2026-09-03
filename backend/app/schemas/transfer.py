from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.om_transaction import OmTransactionOut

class TransferRequest(BaseModel):
    recipient_msisdn: str
    amount: Decimal = Field(gt=0)
    pin: str
    label: str | None = None

class TransferResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    transaction: OmTransactionOut
    new_balance: Decimal