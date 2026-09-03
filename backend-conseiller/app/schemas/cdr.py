from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class CdrRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    occurred_at: datetime
    type: str
    destination_or_origin: str
    duration_or_volume: str
    cost: Decimal
    currency: str
