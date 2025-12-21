# 🔧 Correction : Erreur "requirements.txt: not found" sur Render

## Problème

L'erreur `"/requirements.txt": not found` lors du build Docker sur Render indique que le contexte de build n'est pas correctement configuré.

## Solution rapide

### Pour le service Backend

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service backend
3. Allez dans **"Settings"** (Paramètres)
4. Faites défiler jusqu'à **"Build & Deploy"**
5. Configurez :
   - **Root Directory** : `backend` ⚠️ **IMPORTANT**
   - **Dockerfile Path** : `Dockerfile` (ou laissez vide)
6. Cliquez sur **"Save Changes"**
7. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

### Pour le service Frontend

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service frontend
3. Allez dans **"Settings"** (Paramètres)
4. Faites défiler jusqu'à **"Build & Deploy"**
5. Configurez :
   - **Root Directory** : `frontend` ⚠️ **IMPORTANT**
   - **Dockerfile Path** : `Dockerfile` (ou laissez vide)
6. Cliquez sur **"Save Changes"**
7. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

## Explication

Quand vous configurez un Dockerfile dans un sous-répertoire sur Render :

- ❌ **Mauvais** : 
  - Root Directory : (vide ou racine)
  - Dockerfile Path : `backend/Dockerfile`
  → Docker cherche `requirements.txt` depuis la racine du dépôt, mais il est dans `backend/`

- ✅ **Correct** :
  - Root Directory : `backend`
  - Dockerfile Path : `Dockerfile`
  → Docker utilise `backend/` comme contexte, donc `requirements.txt` est trouvé

## Vérification

Après avoir appliqué ces changements, le build devrait réussir. Vous verrez dans les logs :

```
#9 [4/6] COPY requirements.txt .
#9 DONE
```

Au lieu de :

```
#9 [4/6] COPY requirements.txt .
#9 ERROR: "/requirements.txt": not found
```

## Si le problème persiste

1. Vérifiez que le fichier `requirements.txt` existe bien dans le répertoire `backend/` sur GitHub
2. Vérifiez que le dépôt est correctement connecté à Render
3. Vérifiez que la branche configurée sur Render est la bonne (généralement `main` ou `master`)


