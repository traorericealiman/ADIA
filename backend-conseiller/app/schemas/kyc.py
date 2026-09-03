from datetime import date
from pydantic import BaseModel, ConfigDict

class KycDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    type: str
    number: str
    issued_date: date
    expiry_date: date
    issued_by: str

class KycDocumentUpdate(BaseModel):
    type: str
    number: str
    issued_date: date
    expiry_date: date
    issued_by: str
