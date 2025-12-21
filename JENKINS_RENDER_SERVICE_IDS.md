# 🔧 Configuration des Service IDs Render dans Jenkins

## 🎯 Problème

Erreur dans le pipeline Jenkins :
```
RENDER_FRONTEND_SERVICE_ID and RENDER_BACKEND_SERVICE_ID must be set in Jenkins environment variables
```

## ✅ Solution : Configurer les Service IDs

### Étape 1 : Trouver les Service IDs sur Render

#### Méthode 1 : Via l'URL du service (la plus simple)

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service **frontend**
3. Regardez l'URL dans la barre d'adresse :
   ```
   https://dashboard.render.com/web/srv-xxxxxxxxxxxxxxxx
                                    ^^^^^^^^^^^^^^^^^^^^
                                    C'est le Service ID
   ```
   - Le Service ID commence par `srv-` suivi d'une série de caractères
   - Exemple : `srv-abc123def456ghi789`

4. Répétez pour le service **backend**

#### Méthode 2 : Via l'API Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre profil → **"Account Settings"** → **"API Keys"**
3. Utilisez votre API key pour lister les services :
   ```bash
   curl -H "Authorization: Bearer VOTRE_API_KEY" \
        https://api.render.com/v1/services
   ```
4. Cherchez les services `frontend` et `backend` dans la réponse JSON
5. Notez les `id` de chaque service (ce sont les Service IDs)

#### Méthode 3 : Via les paramètres du service

1. Allez sur votre service dans Render
2. Cliquez sur **"Settings"** (Paramètres)
3. Faites défiler jusqu'à **"Service Details"**
4. Le **Service ID** est affiché dans cette section

### Étape 2 : Configurer dans Jenkins

#### Option A : Variables globales (recommandé pour tous les jobs)

1. Dans Jenkins, allez dans :
   - **"Manage Jenkins"** (Gérer Jenkins)
   - **"Configure System"** (Configurer le système)

2. Faites défiler jusqu'à **"Global properties"** (Propriétés globales)

3. Cochez **"Environment variables"** (Variables d'environnement)

4. Ajoutez deux nouvelles variables :

   **Première variable :**
   - **Name** : `RENDER_FRONTEND_SERVICE_ID`
   - **Value** : votre Service ID frontend (ex: `srv-abc123def456ghi789`)

   **Deuxième variable :**
   - **Name** : `RENDER_BACKEND_SERVICE_ID`
   - **Value** : votre Service ID backend (ex: `srv-xyz789abc123def456`)

5. Cliquez sur **"Save"** (Enregistrer)

#### Option B : Variables par job (pour un job spécifique)

1. Dans votre job Jenkins, cliquez sur **"Configure"** (Configurer)

2. Faites défiler jusqu'à **"Build Environment"** (Environnement de build)

3. Cochez **"Use secret text(s) or file(s)"** ou **"Inject environment variables to the build process"**

4. Ajoutez les variables :
   - **Name** : `RENDER_FRONTEND_SERVICE_ID`
   - **Value** : votre Service ID frontend

   - **Name** : `RENDER_BACKEND_SERVICE_ID`
   - **Value** : votre Service ID backend

5. Cliquez sur **"Save"**

### Étape 3 : Vérifier la configuration

1. Relancez votre pipeline Jenkins
2. Dans les logs du stage "Deploy", vous devriez voir :
   ```
   Frontend Service ID: srv-abc123def456ghi789
   Backend Service ID: srv-xyz789abc123def456
   ```
   Au lieu de :
   ```
   RENDER_FRONTEND_SERVICE_ID and RENDER_BACKEND_SERVICE_ID must be set
   ```

## 📝 Exemple de configuration

Si vos Service IDs sont :
- Frontend : `srv-abc123def456ghi789`
- Backend : `srv-xyz789abc123def456`

Configurez dans Jenkins :
- **RENDER_FRONTEND_SERVICE_ID** = `srv-abc123def456ghi789`
- **RENDER_BACKEND_SERVICE_ID** = `srv-xyz789abc123def456`

## ⚠️ Notes importantes

1. **Le Service ID est différent de l'URL du service**
   - Service ID : `srv-abc123def456ghi789`
   - URL du service : `https://mini-projet-frontend.onrender.com`

2. **Le Service ID est unique pour chaque service**
   - Chaque service (frontend, backend) a son propre Service ID
   - Ne confondez pas les deux

3. **Le Service ID ne change pas**
   - Une fois créé, le Service ID reste le même
   - Vous n'avez besoin de le configurer qu'une seule fois

4. **Sensible à la casse**
   - Assurez-vous de copier le Service ID exactement tel qu'il apparaît
   - Pas d'espaces avant ou après

## 🔍 Vérification rapide

Pour vérifier que les variables sont bien configurées, ajoutez temporairement cette ligne dans votre Jenkinsfile (dans le stage "Deploy") :

```groovy
echo "DEBUG: RENDER_FRONTEND_SERVICE_ID = '${env.RENDER_FRONTEND_SERVICE_ID}'"
echo "DEBUG: RENDER_BACKEND_SERVICE_ID = '${env.RENDER_BACKEND_SERVICE_ID}'"
```

Si vous voyez des valeurs vides ou rien, les variables ne sont pas correctement configurées.

## 🚀 Après configuration

Une fois configuré, le pipeline devrait :
1. ✅ Passer le stage "Deploy"
2. ✅ Déclencher les déploiements sur Render via l'API
3. ✅ Afficher les statuts de déploiement dans les logs

## 📚 Documentation complémentaire

- `RENDER_DEPLOYMENT.md` : Guide complet de déploiement sur Render
- `RENDER_FIX_BUILD_CONTEXT.md` : Correction des erreurs de build context

