from datetime import datetime, timedelta, timezone
from jose import jwt
import hashlib
from app.core.config import settings

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    _has_passlib = True
except Exception:
    _has_passlib = False

def hash_pin(pin: str) -> str:
    if _has_passlib:
        try:
            return pwd_context.hash(pin)
        except Exception:
            pass
    return f"sha256${hashlib.sha256(pin.encode()).hexdigest()}"

def verify_pin(pin: str, pin_hash: str) -> bool:
    if not pin_hash:
        return False
    if pin_hash.startswith("sha256$"):
        return f"sha256${hashlib.sha256(pin.encode()).hexdigest()}" == pin_hash
    if _has_passlib:
        try:
            return pwd_context.verify(pin, pin_hash)
        except Exception:
            pass
    return False

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
