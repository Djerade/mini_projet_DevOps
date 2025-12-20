# Guide de Sécurité - SECRET_KEY Django

## 🔐 Sécurisation de la SECRET_KEY

La `SECRET_KEY` Django est utilisée pour :

- Signer les sessions et cookies
- Générer les tokens CSRF
- Crypter les données sensibles
- Générer les tokens de réinitialisation de mot de passe

**⚠️ NE JAMAIS exposer la SECRET_KEY publiquement !**

## 📋 Configuration

### 1. Générer une SECRET_KEY sécurisée

```bash
cd backend
python manage.py generate_secret_key --output .env
```

Cette commande :

- Génère une clé aléatoire sécurisée de 50 caractères
- L'ajoute automatiquement dans votre fichier `.env`
- Utilise le module `secrets` de Python (cryptographiquement sécurisé)

### 2. Configuration locale (développement)

1. Copiez le fichier d'exemple :

   ```bash
   cp .env.example .env
   ```
2. Générez une SECRET_KEY :

   ```bash
   python manage.py generate_secret_key --output .env
   ```
3. Vérifiez que `.env` est dans `.gitignore` (déjà fait ✅)

### 3. Configuration Docker Compose

Le `docker-compose.yml` utilise maintenant un fichier `.env` à la racine du projet.

Créez un fichier `.env` à la racine avec :

```bash
# Backend
SECRET_KEY=votre-cle-securisee-generee
DEBUG=True
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_HOST=database
DB_PORT=5432
```

### 4. Configuration en production

**⚠️ IMPORTANT : En production, la SECRET_KEY DOIT être définie, sinon l'application refusera de démarrer.**

#### Options recommandées :

**Option A : Variables d'environnement système**

```bash
export SECRET_KEY="votre-cle-securisee"
export DEBUG=False
```

**Option B : Fichier .env (non versionné)**

- Créez un fichier `.env` sur le serveur
- Ne le commitez JAMAIS
- Utilisez des permissions restrictives : `chmod 600 .env`

**Option C : Secrets manager (recommandé pour production)**

- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Kubernetes Secrets

## 🛡️ Protection automatique

Le code dans `settings.py` :

- ✅ Refuse de démarrer en production sans SECRET_KEY
- ✅ Détecte les clés non sécurisées (valeurs par défaut)
- ✅ Génère une clé temporaire uniquement en développement (avec avertissement)

## ⚠️ Vérifications de sécurité

### Avant de déployer :

1. ✅ Vérifiez que `SECRET_KEY` n'est pas dans le code source

   ```bash
   git grep "SECRET_KEY" -- "*.py" "*.env" "*.yml"
   ```
2. ✅ Vérifiez que `.env` est dans `.gitignore`

   ```bash
   git check-ignore .env
   ```
3. ✅ Vérifiez que `DEBUG=False` en production
4. ✅ Utilisez une SECRET_KEY différente pour chaque environnement

## 🔄 Rotation de la SECRET_KEY

Si votre SECRET_KEY est compromise :

1. **Générez une nouvelle clé** :

   ```bash
   wpython manage.py generate_secret_key
   ```
2. **Mettez à jour la variable d'environnement**
3. **⚠️ Note importante** : Changer la SECRET_KEY invalidera :

   - Toutes les sessions utilisateur (déconnexion)
   - Les tokens CSRF
   - Les tokens de réinitialisation de mot de passe

## 📚 Ressources

- [Django Security Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
