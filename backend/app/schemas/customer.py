from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class CustomerListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    first_name: str
    last_name: str
    city: str | None
    avatar_url: str | None

class KycDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    type: str
    number: str
    issued_date: date
    expiry_date: date
    issued_by: str

class OrangeMoneyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    account_number: str
    status: str
    current_balance: Decimal
    is_pin_blocked: bool
    freeze_reason: str | None

class CustomerDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    email: str | None
    city: str | None
    customer_since: date
    kyc_document: KycDocumentOut | None
    orange_money: OrangeMoneyOut | None