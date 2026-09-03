from datetime import time
from pydantic import BaseModel, ConfigDict
from app.schemas.agency import AgencyOut

class AdvisorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    email: str
    role: str
    counter_number: str
    status: str
    served_today_count: int
    login_time: time
    agency: AgencyOut
