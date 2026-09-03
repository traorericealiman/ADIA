from pydantic import BaseModel

class TokenRequest(BaseModel):
    msisdn: str
    pin: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"