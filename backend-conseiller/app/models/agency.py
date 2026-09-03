from sqlalchemy import Column, String, Integer, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Agency(Base):
    __tablename__ = "agencies"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    manager = Column(String, nullable=False)

class Advisor(Base):
    __tablename__ = "advisors"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    agency_id = Column(String, ForeignKey("agencies.id"), nullable=False)
    role = Column(String, nullable=False)
    counter_number = Column(String, nullable=False)
    status = Column(String, nullable=False)
    served_today_count = Column(Integer, nullable=False, default=0)
    login_time = Column(Time, nullable=False)

    agency = relationship("Agency")
