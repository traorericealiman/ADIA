from datetime import datetime
from pydantic import BaseModel, ConfigDict

class SupportTicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime
    assigned_to: str
    description: str

class SupportTicketCreate(BaseModel):
    id: str
    subject: str
    category: str
    priority: str
    status: str = "OUVERT"
    assigned_to: str
    description: str

class SupportTicketStatusUpdate(BaseModel):
    status: str
