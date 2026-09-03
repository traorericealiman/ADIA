from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class CustomerOrangeMoneyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    account_number: str
    status: str
    kyc_level: str
    daily_limit: Decimal
    monthly_limit: Decimal
    current_balance: Decimal
    savings_vault_balance: Decimal
    currency: str
    is_pin_blocked: bool
    failed_pin_attempts_count: int | None
    freeze_reason: str | None
    freeze_date: datetime | None