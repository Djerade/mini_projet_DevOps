# 🔐 Guide Rapide - SECRET_KEY

## Démarrage rapide

### 1. Générer une SECRET_KEY sécurisée

```bash
cd backend
python manage.py generate_secret_key --output .env
```

Cette commande génère automatiquement une clé sécurisée et l'ajoute dans votre fichier `.env`.

### 2. Vérifier que .env existe

```bash
ls -la backend/.env
```

Si le fichier n'existe pas, créez-le :
```bash
cp backend/env.example backend/.env
python manage.py generate_secret_key --output .env
```

### 3. Utiliser avec Docker Compose

Le `docker-compose.yml` charge automatiquement le fichier `backend/.env`.

Assurez-vous que votre fichier `backend/.env` contient :
```
SECRET_KEY=votre-cle-generee
DEBUG=True
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_HOST=database
DB_PORT=5432
```

## ✅ Protection automatique

- ✅ **En production** : L'application refuse de démarrer sans SECRET_KEY
- ✅ **En développement** : Génère une clé temporaire si absente (avec avertissement)
- ✅ **Détection** : Refuse les valeurs par défaut non sécurisées
- ✅ **Génération sécurisée** : Utilise le module `secrets` de Python

## ⚠️ Important

- Ne commitez JAMAIS le fichier `.env`
- Utilisez une SECRET_KEY différente pour chaque environnement
- En production, utilisez un gestionnaire de secrets (AWS Secrets Manager, Vault, etc.)

Pour plus de détails, consultez `SECURITY.md`.

