from pydantic import BaseModel

class AdvisorContext(BaseModel):
    agent_id: str
    agent_name: str
    agency_name: str

class UnblockRequest(AdvisorContext):
    new_pin: str

class FreezeRequest(AdvisorContext):
    reason: str

class UnfreezeRequest(AdvisorContext):
    note: str | None = None