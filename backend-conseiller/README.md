# Backend Conseiller - Portail Agence Orange Côte d'Ivoire 🍊

API Backend dédiée au **Portail Conseiller Agence Orange Côte d'Ivoire**.  
Elle utilise la **même base de données PostgreSQL** et les **mêmes modèles** que le backend principal, mais avec des flux et autorisations adaptés aux conseillers d'agence.

---

## 🎯 Spécificité Principale

Dans l'application client (Maxit), la connexion exige le numéro de téléphone et le code secret PIN du client.  
**Dans ce `backend-conseiller`**, l'accès au profil client s'effectue **UNIQUEMENT avec le numéro de téléphone mobile** (`msisdn`), sans aucun mot de passe / code PIN client requis :

```json
POST /v1/auth/customer-session
{
  "msisdn": "07 08 09 10 11"
}
```

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
cd backend-conseiller
pip install -r requirements.txt
```

### 2. Configuration (`.env`)
Le fichier `.env` est préconfiguré avec la même base de données :
```env
DATABASE_URL = postgresql://sake:PZvLkg6Uz4Hau2El6DtHnlrqgHTaT1HF@dpg-da7v5hoae00c73a7uo6g-a.frankfurt-postgres.render.com/adiadb
JWT_SECRET = 4f6daa8e5ef8972d3037ab4d489967c34373da8ccc74b68db430e12042a446d4
```

### 3. Lancement du serveur API
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Documentation Swagger interactive disponible sur : **`http://127.0.0.1:8001/docs`**

---

## 📡 Endpoints Disponibles

| Méthode | Endpoint | Description | Payload / Paramètres |
|---|---|---|---|
| `POST` | `/v1/auth/customer-session` | Ouvre une session conseiller pour un client | `{"msisdn": "07 08 09 10 11"}` |
| `POST` | `/v1/auth/token` | Alias d'ouverture de session | `{"msisdn": "07 08 09 10 11"}` |
| `POST` | `/v1/customers/lookup` | Récupère la fiche 360° complète du client | `{"msisdn": "07 08 09 10 11"}` |
| `GET` | `/v1/customers/by-phone/{phone}` | Récupère la fiche 360° par URL | `phone_number` |
| `GET` | `/v1/customers/{customer_id}` | Récupère la fiche client par ID | `customer_id` |
| `GET` | `/v1/customers` | Recherche rapide de clients | `?q=nom` |
| `GET` | `/health` | Vérification de l'état de l'API | - |

---

## 📦 Données retournées dans la Fiche 360°
- **Identité & KYC** : Nom, Prénoms, Date de naissance, Pièce d'identité (CNI/Passeport), Nationalité, Adresse, Date d'enrôlement.
- **Télécom & SIM/eSIM** : MSISDN, N° de Série SIM (ICCID), IMSI, Type de réseau (4G+/5G), Code PUK 1 & 2, Code PIN SIM par défaut, Soldes (Voix, Pass Data Go, SMS, Bonus), Historique des consommations d'appels & data (CDR).
- **Orange Money** : Statut du compte (Actif, Bloqué, Gelé), Plafonds, Solde principal, Coffre-fort épargne, Dernières transactions.
- **Historique de Titularité** : Traçabilité chronologique de tous les propriétaires précédents de la puce.
- **Traçabilité des Actions** : Journal de bord de toutes les opérations effectuées sur la ligne en agence.
