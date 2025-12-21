# ⚡ Correction rapide : Erreur "requirements.txt: not found" sur Render

## 🎯 Le problème

```
error: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/requirements.txt": not found
```

Cela signifie que Render cherche `requirements.txt` au mauvais endroit.

## ✅ Solution en 3 étapes

### Étape 1 : Ouvrir les paramètres du service

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service **backend** (celui qui échoue)
3. Cliquez sur **"Settings"** (en haut à droite ou dans le menu)

### Étape 2 : Configurer le Root Directory

1. Faites défiler jusqu'à la section **"Build & Deploy"**
2. Trouvez le champ **"Root Directory"**
3. Entrez : `backend` ⚠️ **IMPORTANT**
4. Vérifiez que **"Dockerfile Path"** est : `Dockerfile` (ou vide)

### Étape 3 : Sauvegarder et redéployer

1. Cliquez sur **"Save Changes"** (en bas de la page)
2. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

## 📸 À quoi ça ressemble

**AVANT (❌ Incorrect)** :
```
Root Directory: (vide)
Dockerfile Path: backend/Dockerfile
```

**APRÈS (✅ Correct)** :
```
Root Directory: backend
Dockerfile Path: Dockerfile
```

## 🔍 Vérification

Après le redéploiement, dans les logs vous devriez voir :
```
#9 [4/6] COPY requirements.txt .
#9 DONE 0.5s
```

Au lieu de l'erreur précédente.

## ⚠️ Important

- **Root Directory** = `backend` (pas `backend/` avec un slash)
- **Dockerfile Path** = `Dockerfile` (pas `backend/Dockerfile`)
- Appliquez la même configuration pour le service **frontend** avec `Root Directory: frontend`

## 📚 Documentation complète

Pour plus de détails, consultez :
- `RENDER_FIX_BUILD_CONTEXT.md` : Guide détaillé
- `RENDER_DEPLOYMENT.md` : Configuration complète de Render

