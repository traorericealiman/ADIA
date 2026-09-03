from datetime import date
from pydantic import BaseModel, ConfigDict
from app.schemas.kyc import KycDocumentOut
from app.schemas.telecom import CustomerTelecomDetailOut
from app.schemas.orange_money import CustomerOrangeMoneyDetailOut
from app.schemas.ownership import SimOwnershipRecordOut
from app.schemas.audit import AuditLogEntryOut
from app.schemas.ticket import SupportTicketOut

class CustomerListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    first_name: str
    last_name: str
    city: str | None
    avatar_url: str | None

class TitulaireActuelPuce(BaseModel):
    """
    Données spécifiques : Titulaire Actuel de la Puce SIM
    """
    model_config = ConfigDict(from_attributes=True)
    id: str
    nom: str
    prenoms: str
    nom_complet: str
    sexe: str
    genre_label: str
    date_de_naissance: date
    nationalite: str
    email: str | None = None
    adresse_residence: str | None = None
    ville: str | None = None
    client_depuis: date
    photo_url: str | None = None
    msisdn: str
    raw_phone: str
    statut_ligne: str
    piece_identite: KycDocumentOut | None = None

class Customer360Profile(BaseModel):
    """
    Fiche Complète 360° du Client pour le Conseiller d'Agence :
    - Informations d'identification & KYC
    - Données Techniques SIM & Ligne Télécom (Code PUK, PIN, Balances, CDR)
    - Compte Orange Money & Transactions
    - Historique de Titularité (Anciens propriétaires)
    - Historique des Actions & Événements (Audit logs)
    - Tickets de Support
    """
    model_config = ConfigDict(from_attributes=True)
    id: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    nationality: str
    email: str | None
    address: str | None
    city: str | None
    avatar_url: str | None
    customer_since: date
    kyc_document: KycDocumentOut | None = None
    telecom: CustomerTelecomDetailOut | None = None
    orange_money: CustomerOrangeMoneyDetailOut | None = None
    ownership_history: list[SimOwnershipRecordOut] = []
    action_audit_logs: list[AuditLogEntryOut] = []
    tickets: list[SupportTicketOut] = []
