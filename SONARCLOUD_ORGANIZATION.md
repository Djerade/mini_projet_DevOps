# 🔑 Configuration de SONAR_ORGANIZATION

## Problème

L'erreur `You must define the following mandatory properties for 'mini_projet_frontend': sonar.organization` indique que SonarCloud nécessite la clé d'organisation.

## Solution : Trouver votre clé d'organisation

### Méthode 1 : Via l'URL SonarCloud

1. Connectez-vous à https://sonarcloud.io
2. Allez dans votre organisation
3. Regardez l'URL dans la barre d'adresse :
   ```
   https://sonarcloud.io/organizations/votre-org-key
   ```
   La partie après `/organizations/` est votre clé d'organisation.

### Méthode 2 : Via l'interface SonarCloud

1. Connectez-vous à https://sonarcloud.io
2. Cliquez sur votre profil (en haut à droite)
3. Allez dans "My Account" → "Organizations"
4. Cliquez sur votre organisation
5. La clé d'organisation est affichée dans les informations de l'organisation

### Méthode 3 : Via un projet existant

1. Allez dans un projet de votre organisation
2. Cliquez sur "Project Information" (en haut à droite)
3. La clé d'organisation fait partie de la "Project Key" :
   - Format : `organisation-key_project-key`
   - Exemple : Si votre Project Key est `mon-org_mini_projet_frontend`, alors `mon-org` est votre clé d'organisation

## Configuration dans Jenkins

### Option A : Variable d'environnement globale (recommandé)

1. Dans Jenkins, allez dans **"Manage Jenkins"** → **"Configure System"**
2. Faites défiler jusqu'à **"Global properties"**
3. Cochez **"Environment variables"**
4. Ajoutez une nouvelle variable :
   - **Name** : `SONAR_ORGANIZATION`
   - **Value** : votre clé d'organisation (ex: `mon-org`)
5. Cliquez sur **"Save"**

### Option B : Variable d'environnement par job

1. Dans votre job Jenkins, allez dans **"Configure"**
2. Faites défiler jusqu'à **"Build Environment"**
3. Cochez **"Use secret text(s) or file(s)"** ou **"Inject environment variables"**
4. Ajoutez :
   - **Name** : `SONAR_ORGANIZATION`
   - **Value** : votre clé d'organisation
5. Cliquez sur **"Save"**

### Option C : Modifier directement le Jenkinsfile

Si vous préférez, vous pouvez modifier directement le Jenkinsfile :

```groovy
environment {
    // ... autres variables ...
    SONAR_ORGANIZATION = 'votre-org-key'  // Remplacez par votre clé
}
```

⚠️ **Note** : Cette méthode n'est pas recommandée si vous partagez le code, car la clé sera visible dans le dépôt.

## Vérification

Après configuration, relancez le pipeline. Le scan devrait maintenant fonctionner.

Si vous voyez toujours une erreur, vérifiez :
- ✅ La clé d'organisation est correcte (sensible à la casse)
- ✅ Le token SonarCloud a les permissions pour cette organisation
- ✅ Le projet existe dans cette organisation

