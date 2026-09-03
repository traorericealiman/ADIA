import sys
import os

# Ajouter la racine du backend au sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.seed import init_db

if __name__ == "__main__":
    print("🚀 Initialisation des tables PostgreSQL et insertion des données...")
    init_db()
    print("✅ Base de données prête !")
