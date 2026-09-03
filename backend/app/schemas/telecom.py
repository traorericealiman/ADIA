from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, model_validator

class TelecomBalancesOut(BaseModel):
    main_credit: Decimal
    currency: str
    credit_validity: str | None
    data_remaining_mb: int
    data_total_mb: int
    data_expiry: date | None
    sms_remaining: int
    bonus_orange: Decimal

class CustomerTelecomOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    msisdn: str
    raw_phone: str
    sim_iccid: str
    imsi: str
    network_type: str
    offer_name: str
    line_status: str
    status_reason: str | None
    activation_date: date
    puk1: str
    puk2: str
    current_pin: str
    balances: TelecomBalancesOut

class CustomerTelecomOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    msisdn: str
    raw_phone: str
    sim_iccid: str
    imsi: str
    network_type: str
    offer_name: str
    line_status: str
    status_reason: str | None
    activation_date: date
    puk1: str
    puk2: str
    current_pin: str
    balances: TelecomBalancesOut

    @model_validator(mode="before")
    @classmethod
    def build_balances(cls, obj):
        if hasattr(obj, "main_credit"):  # objet SQLAlchemy, pas déjà un dict
            return {
                "msisdn": obj.msisdn,
                "raw_phone": obj.raw_phone,
                "sim_iccid": obj.sim_iccid,
                "imsi": obj.imsi,
                "network_type": obj.network_type,
                "offer_name": obj.offer_name,
                "line_status": obj.line_status,
                "status_reason": obj.status_reason,
                "activation_date": obj.activation_date,
                "puk1": obj.puk1,
                "puk2": obj.puk2,
                "current_pin": obj.current_pin,
                "balances": {
                    "main_credit": obj.main_credit,
                    "currency": obj.currency,
                    "credit_validity": obj.credit_validity,
                    "data_remaining_mb": obj.data_remaining_mb,
                    "data_total_mb": obj.data_total_mb,
                    "data_expiry": obj.data_expiry,
                    "sms_remaining": obj.sms_remaining,
                    "bonus_orange": obj.bonus_orange,
                },
            }
        return obj