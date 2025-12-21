# 🔧 Guide étape par étape : Corriger l'erreur "requirements.txt: not found"

## 🎯 Problème

```
error: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/requirements.txt": not found
```

## ✅ Solution détaillée

### Étape 1 : Accéder aux paramètres du service

1. Ouvrez votre navigateur
2. Allez sur **https://dashboard.render.com**
3. Connectez-vous si nécessaire
4. Dans la liste des services, **cliquez sur votre service backend** (celui qui affiche l'erreur)

### Étape 2 : Ouvrir les paramètres

1. Une fois sur la page du service, regardez le menu en haut
2. Cliquez sur l'onglet **"Settings"** (Paramètres)
   - Il se trouve généralement à côté de "Logs", "Metrics", "Events", etc.

### Étape 3 : Trouver la section "Build & Deploy"

1. Faites défiler la page vers le bas
2. Cherchez la section **"Build & Deploy"** (Build et déploiement)
3. Cette section contient les paramètres de build Docker

### Étape 4 : Configurer le Root Directory

Dans la section "Build & Deploy", vous verrez plusieurs champs :

1. **"Root Directory"** (Répertoire racine)
   - **AVANT** : Ce champ est probablement **vide** ou contient `/` ou `.`
   - **ACTION** : Cliquez dans ce champ et tapez : `backend`
   - ⚠️ **IMPORTANT** : Tapez exactement `backend` (sans slash, sans guillemets)

2. **"Dockerfile Path"** (Chemin du Dockerfile)
   - **AVANT** : Peut contenir `backend/Dockerfile` ou `Dockerfile`
   - **ACTION** : Assurez-vous qu'il contient **uniquement** `Dockerfile`
   - Si le champ est vide, c'est OK aussi (Render utilisera `Dockerfile` par défaut)

### Étape 5 : Vérifier les autres paramètres

Assurez-vous que :
- **"Environment"** = `Docker`
- **"Dockerfile Path"** = `Dockerfile` (ou vide)
- **"Root Directory"** = `backend`

### Étape 6 : Sauvegarder

1. Faites défiler jusqu'en bas de la page
2. Cliquez sur le bouton **"Save Changes"** (Enregistrer les modifications)
3. Attendez la confirmation que les changements ont été sauvegardés

### Étape 7 : Redéployer

1. Une fois les changements sauvegardés, vous verrez un bouton **"Manual Deploy"** (Déploiement manuel)
2. Cliquez sur **"Manual Deploy"**
3. Sélectionnez **"Deploy latest commit"** (Déployer le dernier commit)
4. Le déploiement va commencer

### Étape 8 : Vérifier les logs

1. Cliquez sur l'onglet **"Logs"** pour voir le déploiement en cours
2. Vous devriez voir :
   ```
   #9 [4/6] COPY requirements.txt .
   #9 DONE 0.5s
   ```
   Au lieu de l'erreur précédente

## 📋 Résumé de la configuration

**Configuration CORRECTE** :
```
Root Directory: backend
Dockerfile Path: Dockerfile
Environment: Docker
```

**Configuration INCORRECTE** (ce qui cause l'erreur) :
```
Root Directory: (vide ou / ou .)
Dockerfile Path: backend/Dockerfile
Environment: Docker
```

## 🔍 Vérifications supplémentaires

Si le problème persiste après avoir configuré le Root Directory :

### 1. Vérifier que le fichier existe dans Git

```bash
git ls-files backend/requirements.txt
```

Si cette commande ne retourne rien, le fichier n'est pas dans Git. Ajoutez-le :
```bash
git add backend/requirements.txt
git commit -m "Add requirements.txt"
git push
```

### 2. Vérifier la branche sur Render

1. Dans les paramètres du service Render
2. Section "Build & Deploy"
3. Vérifiez que **"Branch"** (Branche) correspond à votre branche Git
   - Si vous utilisez `dev`, assurez-vous que Render est configuré pour `dev`
   - Si vous utilisez `main`, assurez-vous que Render est configuré pour `main`

### 3. Vérifier que le commit est bien poussé

```bash
git log --oneline -1
git push origin dev  # ou main, selon votre branche
```

## 🎯 Pour le service Frontend

Appliquez la même configuration pour le service frontend :
- **Root Directory** : `frontend`
- **Dockerfile Path** : `Dockerfile`

## 📞 Si le problème persiste

1. Vérifiez que vous avez bien cliqué sur "Save Changes"
2. Vérifiez que le redéploiement a bien démarré
3. Consultez les logs complets dans Render
4. Vérifiez que le dépôt GitHub est correctement connecté à Render

## 📚 Documentation complémentaire

- `RENDER_QUICK_FIX.md` : Guide rapide
- `RENDER_FIX_BUILD_CONTEXT.md` : Explication détaillée du problème
- `RENDER_DEPLOYMENT.md` : Configuration complète de Render

