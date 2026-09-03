from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import customer, agency, advisor, kyc, telecom, cdr, orange_money, om_transaction, ownership, audit, ticket, me, auth, transfers, orange_money_actions, titulaire
from app.db.seed import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_db()
    except Exception as e:
        print(f"Warning init_db: {e}")
    yield

app = FastAPI(title="Orange CI Telecom & OM API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(me.router)
app.include_router(auth.router)
app.include_router(transfers.router)
app.include_router(orange_money_actions.router)

@app.get("/health")
def health():
    return {"status": "ok"}