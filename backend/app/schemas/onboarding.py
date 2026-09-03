from datetime import date
from decimal import Decimal
from pydantic import BaseModel

class KycIn(BaseModel):
    type: str
    number: str
    issued_date: date
    expiry_date: date
    issued_by: str

class TelecomIn(BaseModel):
    msisdn: str
    raw_phone: str
    sim_iccid: str
    imsi: str
    network_type: str
    offer_name: str
    puk1: str
    puk2: str
    sim_pin: str = "0000"

class OrangeMoneyIn(BaseModel):
    daily_limit: Decimal
    monthly_limit: Decimal
    kyc_level: str
    initial_pin: str

class CustomerOnboarding(BaseModel):
    id: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    nationality: str
    email: str | None = None
    address: str | None = None
    city: str | None = None
    kyc: KycIn
    telecom: TelecomIn
    orange_money: OrangeMoneyIn
    agent_id: str
    agent_name: str
    agency_name: str