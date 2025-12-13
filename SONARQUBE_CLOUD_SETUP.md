# Configuration SonarQube Cloud pour Jenkins

## Problème courant : "Project does not exist"

Si vous voyez une erreur lors du scan, c'est probablement parce que le projet n'existe pas encore dans SonarCloud.

## Étapes pour créer le projet dans SonarCloud

### 1. Créer un compte SonarCloud

1. Allez sur https://sonarcloud.io
2. Cliquez sur "Log in" et connectez-vous avec GitHub, GitLab, Bitbucket ou Microsoft
3. Acceptez les conditions d'utilisation

### 2. Créer une organisation

1. Une fois connecté, créez une organisation (gratuite pour les projets open source)
2. Choisissez un nom pour votre organisation (ex: `votre-username`)

### 3. Créer un projet

**Option A : Via GitHub (recommandé)**
1. Dans votre organisation, cliquez sur "Add Project"
2. Sélectionnez "From GitHub"
3. Autorisez SonarCloud à accéder à votre dépôt
4. Sélectionnez votre dépôt `mini_projet_DevOps`
5. SonarCloud créera automatiquement un projet

**Option B : Manuellement**
1. Dans votre organisation, cliquez sur "Add Project"
2. Sélectionnez "Manually"
3. Donnez un nom au projet : `mini_projet_frontend`
4. Donnez une clé au projet : `mini_projet_frontend` (doit correspondre exactement au `projectKey` dans Jenkinsfile)

### 4. Obtenir la clé exacte du projet

Une fois le projet créé :
1. Allez dans votre projet dans SonarCloud
2. Cliquez sur "Project Information" (en haut à droite)
3. Notez la **Project Key** exacte (ex: `votre-org_mini_projet_frontend` ou `mini_projet_frontend`)

### 5. Mettre à jour le Jenkinsfile (si nécessaire)

Si la clé du projet dans SonarCloud est différente de `mini_projet_frontend`, mettez à jour le Jenkinsfile :

```groovy
-Dsonar.projectKey=votre-org_mini_projet_frontend
```

### 6. Générer un token

1. Cliquez sur votre profil (en haut à droite)
2. Allez dans "My Account" → "Security"
3. Dans "Generate Tokens", donnez un nom (ex: "jenkins-token")
4. Cliquez sur "Generate"
5. **Copiez le token immédiatement** (il ne sera plus visible après)

### 7. Mettre à jour le token dans Jenkins

1. Dans Jenkins, allez dans "Manage Jenkins" → "Credentials"
2. Trouvez ou créez la credential `sonar-token` :
   - Type : "Secret text"
   - Secret : collez votre token SonarCloud
   - ID : `sonar-token`
   - Description : "SonarCloud token"

### 8. Relancer le pipeline

Relancez le pipeline Jenkins. Le scan devrait maintenant fonctionner.

## Vérification

Pour vérifier que tout fonctionne :
1. Le scan devrait se terminer avec succès
2. Les résultats devraient apparaître dans SonarCloud
3. Vous pouvez voir les issues de code dans l'interface SonarCloud

## Notes importantes

- Le `projectKey` dans le Jenkinsfile **doit correspondre exactement** à celui dans SonarCloud
- Le token doit avoir les permissions pour analyser le projet
- Si vous utilisez une organisation, la clé est souvent : `organisation_projectkey`
