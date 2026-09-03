from pydantic import BaseModel, ConfigDict

class AgencyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    city: str
    address: str
    phone: str
    manager: str