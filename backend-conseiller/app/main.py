from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    titulaire,
    customer,
    agency,
    advisor,
    kyc,
    telecom,
    cdr,
    orange_money,
    om_transaction,
    ownership,
    audit,
    ticket,
    auth,
)
from app.db.seed import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_db()
    except Exception as e:
        print(f"Warning init_db: {e}")
    yield

app = FastAPI(
    title="Orange Côte d'Ivoire - Portail Conseiller Agence API",
    description="API Conseiller d'Agence : Consultation 360°, Titulaire Actuel de la Puce, Télécom, OM et Historique.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion modulaire de tous les routeurs
app.include_router(titulaire.router)
app.include_router(customer.router)
app.include_router(agency.router)
app.include_router(advisor.router)
app.include_router(kyc.router)
app.include_router(telecom.router)
app.include_router(cdr.router)
app.include_router(orange_money.router)
app.include_router(om_transaction.router)
app.include_router(ownership.router)
app.include_router(audit.router)
app.include_router(ticket.router)
app.include_router(auth.router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "backend-conseiller",
        "database": "connected"
    }

@app.get("/")
def root():
    return {
        "message": "API Portail Conseiller Orange Côte d'Ivoire",
        "documentation": "/docs"
    }
