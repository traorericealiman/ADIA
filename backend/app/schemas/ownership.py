from datetime import date
from pydantic import BaseModel, ConfigDict
from app.schemas.onboarding import KycIn

class OwnershipTransferRequest(BaseModel):
    new_owner_name: str
    new_owner_id_document: str
    new_owner_phone_contact: str
    new_kyc: KycIn
    reason: str
    agent_id: str
    agent_name: str
    agency_name: str
    
class SimOwnershipRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    owner_name: str
    owner_id_document: str
    owner_phone_contact: str
    period_start: date
    period_end: date | None
    is_current: bool
    reason: str
    agency: str
    registered_by_agent: str
    notes: str | None