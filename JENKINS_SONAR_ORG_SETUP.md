# ⚙️ Configuration de SONAR_ORGANIZATION dans Jenkins

## 🎯 Problème

Erreur dans le pipeline Jenkins :
```
ERROR: SONAR_ORGANIZATION is not set
Please configure SONAR_ORGANIZATION in Jenkins environment variables
```

## ✅ Solution : Configurer la variable d'environnement

### Étape 1 : Trouver votre clé d'organisation SonarCloud

1. Allez sur https://sonarcloud.io et connectez-vous
2. Cliquez sur votre profil (en haut à droite) → **"My Account"** → **"Organizations"**
3. Cliquez sur votre organisation
4. La **clé d'organisation** (Organization Key) est affichée
   - Exemple : `djerade` ou `mon-org-key`
   - ⚠️ **Notez cette clé exactement** (sensible à la casse)

**Alternative** : Regardez l'URL de votre organisation :
```
https://sonarcloud.io/organizations/votre-org-key
                                    ^^^^^^^^^^^^^^^^
                                    C'est votre clé
```

### Étape 2 : Configurer dans Jenkins (Méthode recommandée)

#### Option A : Variable globale (pour tous les jobs)

1. Dans Jenkins, allez dans :
   - **"Manage Jenkins"** (Gérer Jenkins)
   - **"Configure System"** (Configurer le système)

2. Faites défiler jusqu'à **"Global properties"** (Propriétés globales)

3. Cochez **"Environment variables"** (Variables d'environnement)

4. Cliquez sur **"Add"** pour ajouter une nouvelle variable :
   - **Name** : `SONAR_ORGANIZATION`
   - **Value** : votre clé d'organisation (ex: `djerade`)

5. Cliquez sur **"Save"** (Enregistrer)

#### Option B : Variable par job (pour un job spécifique)

1. Dans votre job Jenkins, cliquez sur **"Configure"** (Configurer)

2. Faites défiler jusqu'à **"Build Environment"** (Environnement de build)

3. Cochez **"Use secret text(s) or file(s)"** ou **"Inject environment variables to the build process"**

4. Ajoutez une variable :
   - **Name** : `SONAR_ORGANIZATION`
   - **Value** : votre clé d'organisation

5. Cliquez sur **"Save"**

### Étape 3 : Vérifier la configuration

1. Relancez votre pipeline Jenkins
2. Dans les logs du stage "SonarQube scan", vous devriez voir :
   ```
   SONAR_ORGANIZATION: votre-org-key
   ```
   Au lieu de :
   ```
   ERROR: SONAR_ORGANIZATION is not set
   ```

## 🔍 Vérification rapide

Pour vérifier que la variable est bien configurée, ajoutez temporairement cette ligne dans votre Jenkinsfile (dans le stage "SonarQube scan") :

```groovy
echo "DEBUG: SONAR_ORGANIZATION = '${SONAR_ORGANIZATION}'"
```

Si vous voyez une valeur vide ou rien, la variable n'est pas correctement configurée.

## 📝 Exemple de configuration

Si votre organisation SonarCloud est `djerade`, configurez :

- **Name** : `SONAR_ORGANIZATION`
- **Value** : `djerade`

## ⚠️ Erreurs courantes

### "SONAR_ORGANIZATION is not set" persiste

1. Vérifiez que vous avez bien cliqué sur **"Save"** après avoir ajouté la variable
2. Vérifiez que le nom de la variable est exactement `SONAR_ORGANIZATION` (en majuscules)
3. Redémarrez Jenkins si nécessaire (rarement requis)
4. Vérifiez que vous avez configuré la variable au bon niveau (global ou job)

### "Project does not exist" dans SonarCloud

1. Vérifiez que le projet `mini_projet_frontend` existe dans votre organisation SonarCloud
2. Vérifiez que la clé d'organisation est correcte
3. Vérifiez que le token SonarCloud a les permissions pour cette organisation

## 🚀 Après configuration

Une fois configuré, le pipeline devrait :
1. ✅ Passer le stage "SonarQube scan"
2. ✅ Envoyer les résultats à SonarCloud
3. ✅ Afficher les métriques de qualité de code dans SonarCloud

## 📚 Documentation complémentaire

- `SONARCLOUD_ORGANIZATION.md` : Comment trouver votre clé d'organisation
- `SONARQUBE_CLOUD_SETUP.md` : Configuration complète de SonarCloud

