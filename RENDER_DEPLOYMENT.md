# 🚀 Configuration du déploiement sur Render

Ce guide explique comment configurer le déploiement automatique sur Render depuis Jenkins.

## Prérequis

1. Un compte Render (https://render.com)
2. Des services créés sur Render pour le frontend et le backend
3. Une API key Render

## Étape 1 : Créer les services sur Render

### Frontend Service

1. Allez sur https://dashboard.render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre dépôt GitHub
4. Configurez :
   - **Name** : `mini-projet-frontend` (ou votre nom)
   - **Environment** : `Docker`
   - **Root Directory** : `frontend` ⚠️ **IMPORTANT**
   - **Dockerfile Path** : `Dockerfile` (ou laisser vide si le Dockerfile est à la racine du Root Directory)
   - **Port** : `3000`
   - **Build Command** : (laissé vide, géré par Dockerfile)
   - **Start Command** : (laissé vide, géré par Dockerfile)
5. Ajoutez les variables d'environnement :
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL=https://votre-backend.onrender.com/api` https://mini-projet-devops-backend.onrender.com
6. Notez le **Service ID** (visible dans l'URL : `https://dashboard.render.com/web/votre-service-id`)

### Backend Service

1. Allez sur https://dashboard.render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre dépôt GitHub
4. Configurez :
   - **Name** : `mini-projet-backend` (ou votre nom)
   - **Environment** : `Docker`
   - **Root Directory** : `backend` ⚠️ **IMPORTANT**
   - **Dockerfile Path** : `Dockerfile` (ou laisser vide si le Dockerfile est à la racine du Root Directory)
   - **Port** : `8000`
5. Ajoutez les variables d'environnement :
   - `SECRET_KEY` : (générez une clé sécurisée)
   - `DEBUG=False`
   - `DB_HOST` : (si vous utilisez une base de données Render)
   - `DB_PORT` : (port de la base de données)
   - `POSTGRES_DB` : (nom de la base de données)
   - `POSTGRES_USER` : (utilisateur de la base de données)
   - `POSTGRES_PASSWORD` : (mot de passe de la base de données)
6. Notez le **Service ID**

### Base de données (optionnel)

Si vous utilisez une base de données PostgreSQL sur Render :

1. Allez sur https://dashboard.render.com
2. Cliquez sur "New +" → "PostgreSQL"
3. Configurez votre base de données
4. Notez les informations de connexion (host, port, database, user, password)
5. Ajoutez ces informations comme variables d'environnement dans votre service backend

## Étape 2 : Obtenir l'API Key Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre profil (en haut à droite)
3. Allez dans "Account Settings" → "API Keys"
4. Cliquez sur "New API Key"
5. Donnez un nom (ex: "jenkins-deployment")rnd_KpxkML8br9HVWAR6zZGyIqTtQ33f
6. **Copiez immédiatement la clé** (elle ne sera plus visible après)

## Étape 3 : Configurer Jenkins

### Option A : Utiliser les credentials Jenkins (recommandé)

1. Dans Jenkins, allez dans **"Manage Jenkins"** → **"Credentials"**
2. Cliquez sur **"Add Credentials"**
3. Configurez :
   - **Kind** : `Secret text`
   - **Secret** : collez votre API key Render
   - **ID** : `render-api-key`
   - **Description** : "Render API Key for deployment"
4. Cliquez sur **"OK"**

### Option B : Variables d'environnement globales

1. Dans Jenkins, allez dans **"Manage Jenkins"** → **"Configure System"**
2. Faites défiler jusqu'à **"Global properties"**
3. Cochez **"Environment variables"**
4. Ajoutez les variables suivantes :
   - **Name** : `RENDER_API_KEY` → **Value** : votre API key Render
   - **Name** : `RENDER_FRONTEND_SERVICE_ID` → **Value** : ID du service frontend
   - **Name** : `RENDER_BACKEND_SERVICE_ID` → **Value** : ID du service backend
5. Cliquez sur **"Save"**

### Option C : Variables par job

1. Dans votre job Jenkins, allez dans **"Configure"**
2. Faites défiler jusqu'à **"Build Environment"**
3. Cochez **"Use secret text(s) or file(s)"** ou **"Inject environment variables"**
4. Ajoutez les variables :
   - `RENDER_FRONTEND_SERVICE_ID` : ID du service frontend
   - `RENDER_BACKEND_SERVICE_ID` : ID du service backend
5. Cliquez sur **"Save"**

## Étape 4 : Trouver les Service IDs

Les Service IDs sont visibles dans l'URL de votre service sur Render :

```
https://dashboard.render.com/web/votre-service-id
                                    ^^^^^^^^^^^^^^^^
                                    C'est le Service ID
```

Ou dans les paramètres du service :
1. Allez dans votre service sur Render
2. Cliquez sur "Settings"
3. Le Service ID est affiché en haut de la page

## Comment ça fonctionne

Le stage "Deploy" dans le Jenkinsfile :

1. Utilise l'API Render pour déclencher un déploiement
2. Envoie une requête POST à l'API Render pour chaque service
3. Render récupère automatiquement les dernières images Docker depuis Docker Hub
4. Déploie les nouvelles versions

## Vérification

Après configuration, relancez le pipeline Jenkins. Le stage "Deploy" devrait :

1. ✅ Déclencher le déploiement du backend sur Render
2. ✅ Déclencher le déploiement du frontend sur Render
3. ✅ Afficher un message de succès

Vous pouvez vérifier le statut des déploiements sur https://dashboard.render.com

## Notes importantes

- Les images Docker doivent être poussées sur Docker Hub **avant** le déploiement (stage "Push")
- Render récupère automatiquement les dernières images depuis Docker Hub
- Les déploiements peuvent prendre quelques minutes
- Assurez-vous que les variables d'environnement sont correctement configurées sur Render
- Le frontend doit pointer vers l'URL du backend déployé (pas `localhost`)

## Dépannage

### Erreur : "requirements.txt: not found" ou "package.json: not found"

**Cause** : Le contexte de build Docker n'est pas correctement configuré.

**Solution** :
1. Allez dans les paramètres de votre service sur Render
2. Vérifiez que **"Root Directory"** est configuré :
   - Pour le backend : `backend`
   - Pour le frontend : `frontend`
3. Le **"Dockerfile Path"** doit être `Dockerfile` (pas `backend/Dockerfile` ou `frontend/Dockerfile`)
4. Sauvegardez et redéployez

**Explication** : Le "Root Directory" définit le contexte de build Docker. Si vous mettez `backend` comme Root Directory, Docker cherchera les fichiers depuis ce répertoire, donc `Dockerfile` au lieu de `backend/Dockerfile`.

### Erreur : "RENDER_API_KEY is not set"
→ Vérifiez que la credential `render-api-key` existe dans Jenkins

### Erreur : "Service not found"
→ Vérifiez que les Service IDs sont corrects

### Le déploiement ne se déclenche pas
→ Vérifiez que les images sont bien poussées sur Docker Hub
→ Vérifiez les logs Render dans le dashboard

### Le service ne démarre pas
→ Vérifiez les variables d'environnement sur Render
→ Vérifiez les logs du service sur Render

