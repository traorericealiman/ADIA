from pydantic import BaseModel, Field

class CustomerLookupRequest(BaseModel):
    """
    Connexion / Recherche Conseiller : demande UNIQUEMENT le numéro de téléphone mobile.
    Aucun mot de passe / PIN client n'est requis pour le conseiller d'agence.
    """
    msisdn: str = Field(..., description="Numéro de téléphone mobile du client (ex: 0708091011 ou 07 08 09 10 11)")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer_id: str
    first_name: str
    last_name: str
    msisdn: str
