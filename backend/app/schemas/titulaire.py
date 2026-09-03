from datetime import date
from pydantic import BaseModel, ConfigDict

class PieceIdentiteDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    type: str
    numero: str
    date_delivrance: date | None = None
    date_expiration: date | None = None
    emetteur: str | None = None
    affichage_complet: str

class TitulaireActuelResponse(BaseModel):
    """
    Données complètes renvoyées par l'API pour la carte 'Titulaire Actuel de la Puce'
    """
    model_config = ConfigDict(from_attributes=True)
    customer_id: str
    numero_telephone: str
    raw_phone: str
    statut_ligne: str
    nom: str
    prenoms: str
    nom_complet: str
    genre: str
    genre_libelle: str
    date_naissance: date
    date_naissance_texte: str
    nationalite: str
    piece_identite: PieceIdentiteDetail
    adresse_residence: str
    ville: str
    email: str | None = None
    client_depuis: date
    client_depuis_texte: str
    photo_url: str | None = None
