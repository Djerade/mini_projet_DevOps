# Configuration SonarQube Cloud

## Étapes pour configurer SonarQube Cloud

### 1. Créer un compte SonarCloud

1. Allez sur https://sonarcloud.io
2. Cliquez sur "Log in" et connectez-vous avec GitHub, GitLab, Bitbucket ou Microsoft
3. Acceptez les conditions d'utilisation

### 2. Créer une organisation

1. Une fois connecté, créez une organisation (gratuite pour les projets open source)
2. Choisissez un nom pour votre organisation

### 3. Créer un projet

1. Dans votre organisation, cliquez sur "Add Project"
2. Sélectionnez votre dépôt GitHub (ou autre)
3. SonarCloud créera automatiquement un projet avec une clé unique

### 4. Générer un token

1. Cliquez sur votre profil (en haut à droite)
2. Allez dans "My Account" → "Security"
3. Dans "Generate Tokens", donnez un nom (ex: "jenkins-token")
4. Cliquez sur "Generate"
5. **Copiez le token immédiatement** (il ne sera plus visible après)

### 5. Mettre à jour le token dans Jenkins

1. Dans Jenkins, allez dans "Manage Jenkins" → "Credentials"
2. Trouvez la credential `sonar-token`
3. Mettez à jour avec le nouveau token SonarCloud
4. Si la credential n'existe pas, créez-en une :
   - Type : "Secret text"
   - Secret : collez votre token SonarCloud
   - ID : `sonar-token`

### 6. Mettre à jour la clé du projet (optionnel)

Si votre projet SonarCloud a une clé différente de `mini_projet_frontend`, mettez à jour dans le `Jenkinsfile` :

```groovy
-Dsonar.projectKey=votre_organisation_votre_projet
```

Vous pouvez trouver la clé exacte dans SonarCloud → Votre projet → Project Information

### 7. Configuration du Jenkinsfile

Le `Jenkinsfile` est déjà configuré avec :
- `SONAR_HOST_URL = 'https://sonarcloud.io'`
- Utilisation du token depuis Jenkins credentials

## Avantages de SonarQube Cloud

✅ Pas besoin d'installer/maintenir SonarQube localement
✅ Pas de problèmes de ressources (RAM/CPU)
✅ Mises à jour automatiques
✅ Gratuit pour les projets open source
✅ Intégration GitHub/GitLab native

## Notes importantes

- Le token SonarCloud est différent d'un token SonarQube local
- Assurez-vous que le `projectKey` dans le Jenkinsfile correspond à celui dans SonarCloud
- SonarCloud analyse automatiquement les pull requests si votre repo est connecté

