from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.core.security import decode_access_token
from app.models.customer import Customer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")

def get_current_customer(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Customer:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session invalide, reconnecte-toi",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        customer_id = payload.get("sub")
        if customer_id is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise credentials_error
    return customer