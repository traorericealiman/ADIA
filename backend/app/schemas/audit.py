from datetime import datetime
from pydantic import BaseModel, ConfigDict

class AuditLogEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    occurred_at: datetime
    category: str
    action: str
    details: str
    agent_id: str
    agent_name: str
    agency_name: str