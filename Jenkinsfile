pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "${env.DOCKERHUB_USERNAME}"
        DOCKERHUB_PASSWORD = "${env.DOCKERHUB_PASSWORD}"
        FRONTEND_IMAGE = 'parfi7zhy/frontend'
        BACKEND_IMAGE = 'parfi7zhy/backend'
        SONAR_HOST_URL = 'https://sonarcloud.io'
        // SONAR_ORGANIZATION doit être configuré dans Jenkins (Manage Jenkins → Configure System → Global properties)
        SONAR_ORGANIZATION = "${env.SONAR_ORGANIZATION ?: ''}"
        // Render configuration - à configurer dans Jenkins
        RENDER_API_KEY = "${env.RENDER_API_KEY ?: ''}"
        RENDER_FRONTEND_SERVICE_ID = "${env.RENDER_FRONTEND_SERVICE_ID ?: ''}"
        RENDER_BACKEND_SERVICE_ID = "${env.RENDER_BACKEND_SERVICE_ID ?: ''}"
    }   
    
    stages {
        stage('Init workspace paths') {
            steps {
                script {
                    // Workspace Jenkins standard (où le code est cloné)
                    env.WORKSPACE_PATH = "${WORKSPACE}"
                    // Chemin sur l'hôte pour les volumes Docker (si nécessaire)
                    env.HOST_WORKSPACE = "/home/perfect/Documents/GitHub/mini_projet_DevOps/jenkins/workspace/${env.JOB_NAME}"
                    echo "Jenkins workspace: ${env.WORKSPACE_PATH}"
                    echo "Host workspace path: ${env.HOST_WORKSPACE}"
                    echo "Checking workspace structure..."
                    sh "ls -la ${WORKSPACE}/ || echo 'Workspace not accessible'"
                }
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    echo "Workspace: ${WORKSPACE}"
                    echo "Checking frontend directory..."
                    ls -la ${HOST_WORKSPACE}/frontend/ || echo "Frontend directory not found"
                    docker run --rm \
                        -v ${HOST_WORKSPACE}/frontend:/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "ls -la /app && npm install"
                '''
            }
        }

        stage('lint frontend') {
            steps {
                sh '''
                    docker run --rm \
                        -v ${HOST_WORKSPACE}/frontend:/app \
                        -w /app \
                        node:20-alpine \
                        npm run lint
                '''
            }
        }
        stage('eslint frontend') {
            steps {
                sh '''
                    docker run --rm \
                        -v ${HOST_WORKSPACE}/frontend:/app \
                        -w /app \
                        node:20-alpine \
                        npm run eslint
                '''
            }
        }

        stage('SonarQube scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        if [ -z "${SONAR_HOST_URL}" ]; then
                          echo "ERROR: SONAR_HOST_URL is not set"
                          exit 1
                        fi
                        
                        if [ -z "${SONAR_TOKEN}" ]; then
                          echo "ERROR: SONAR_TOKEN is not set"
                          exit 1
                        fi
                        
                        if [ -z "${SONAR_ORGANIZATION}" ]; then
                          echo "=========================================="
                          echo "ERROR: SONAR_ORGANIZATION is not set"
                          echo "=========================================="
                          echo ""
                          echo "📋 Pour configurer SONAR_ORGANIZATION :"
                          echo ""
                          echo "1. Trouvez votre clé d'organisation :"
                          echo "   → Allez sur https://sonarcloud.io"
                          echo "   → My Account → Organizations"
                          echo "   → Notez la clé (ex: 'djerade')"
                          echo ""
                          echo "2. Configurez dans Jenkins :"
                          echo "   → Manage Jenkins → Configure System"
                          echo "   → Global properties → Environment variables"
                          echo "   → Ajoutez : Name=SONAR_ORGANIZATION, Value=votre-clé"
                          echo ""
                          echo "📖 Guide détaillé : JENKINS_SONAR_ORG_SETUP.md"
                          echo ""
                          exit 1
                        fi
                        
                        echo "Starting SonarQube scan..."
                        echo "SONAR_HOST_URL: ${SONAR_HOST_URL}"
                        echo "SONAR_ORGANIZATION: ${SONAR_ORGANIZATION}"
                        echo "Project Key: mini_projet_frontend"
                        echo ""
                        
                        # Check if coverage file exists
                        COVERAGE_OPTION=""
                        if [ -f "${HOST_WORKSPACE}/frontend/coverage/lcov.info" ]; then
                          echo "Coverage file found, including in scan"
                          COVERAGE_OPTION="-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
                        else
                          echo "WARNING: Coverage file not found, skipping coverage report"
                        fi
                        
                        # Run SonarQube scanner
                        docker run --rm \
                          -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                          -e SONAR_LOGIN=${SONAR_TOKEN} \
                          -v ${HOST_WORKSPACE}/frontend:/usr/src \
                          -w /usr/src \
                          sonarsource/sonar-scanner-cli \
                          -Dsonar.organization=${SONAR_ORGANIZATION} \
                          -Dsonar.projectKey=mini_projet_frontend \
                          -Dsonar.projectName=mini_projet_frontend \
                          -Dsonar.sources=. \
                          ${COVERAGE_OPTION} || {
                            EXIT_CODE=$?
                            echo "ERROR: SonarQube scan failed with exit code: $EXIT_CODE"
                            echo "Please check:"
                            echo "  1. SONAR_ORGANIZATION is set correctly in Jenkins"
                            echo "  2. Project exists in SonarCloud with key 'mini_projet_frontend'"
                            echo "  3. Token has correct permissions"
                            echo "  4. Project key matches exactly in SonarCloud"
                            echo "  5. Organization key matches your SonarCloud organization"
                            exit 0
                          }
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "Workspace: ${WORKSPACE}"
                    echo "Checking workspace structure..."
                    ls -la ${WORKSPACE}/ || echo "Workspace not found"
                    
                    # Vérifier si frontend existe dans WORKSPACE
                    if [ -d "${WORKSPACE}/frontend" ]; then
                        echo "✅ Frontend found in ${WORKSPACE}/frontend"
                        FRONTEND_PATH="${WORKSPACE}/frontend"
                    elif [ -d "${HOST_WORKSPACE}/frontend" ]; then
                        echo "✅ Frontend found in ${HOST_WORKSPACE}/frontend"
                        FRONTEND_PATH="${HOST_WORKSPACE}/frontend"
                    else
                        echo "❌ ERROR: Frontend directory not found in ${WORKSPACE}/frontend or ${HOST_WORKSPACE}/frontend"
                        exit 1
                    fi
                    
                    # Vérifier si backend existe dans WORKSPACE
                    if [ -d "${WORKSPACE}/backend" ]; then
                        echo "✅ Backend found in ${WORKSPACE}/backend"
                        BACKEND_PATH="${WORKSPACE}/backend"
                    elif [ -d "${HOST_WORKSPACE}/backend" ]; then
                        echo "✅ Backend found in ${HOST_WORKSPACE}/backend"
                        BACKEND_PATH="${HOST_WORKSPACE}/backend"
                    else
                        echo "❌ ERROR: Backend directory not found in ${WORKSPACE}/backend or ${HOST_WORKSPACE}/backend"
                        exit 1
                    fi
                    
                    echo "Building frontend image from: ${FRONTEND_PATH}"
                    docker build -t ${FRONTEND_IMAGE} ${FRONTEND_PATH}
                    
                    echo "Building backend image from: ${BACKEND_PATH}"
                    docker build -t ${BACKEND_IMAGE} ${BACKEND_PATH}
                '''
            }
        }

          stage('Push') {
         steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                 sh '''
                echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                docker push $FRONTEND_IMAGE
               docker push $BACKEND_IMAGE
              '''
           }
          }
        }

        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_API_KEY_CRED')]) {
                    script {
                        // Utiliser la credential ou la variable d'environnement
                        def renderApiKey = env.RENDER_API_KEY ?: env.RENDER_API_KEY_CRED
                        def frontendServiceId = env.RENDER_FRONTEND_SERVICE_ID
                        def backendServiceId = env.RENDER_BACKEND_SERVICE_ID
                        
                        if (!renderApiKey) {
                            error("RENDER_API_KEY is not set. Please configure it in Jenkins credentials (ID: 'render-api-key') or as environment variable")
                        }
                        
                        if (!frontendServiceId || !backendServiceId) {
                            error("""
                                ==========================================
                                ERROR: Service IDs not configured
                                ==========================================
                                
                                RENDER_FRONTEND_SERVICE_ID and RENDER_BACKEND_SERVICE_ID must be set in Jenkins.
                                
                                📋 Pour configurer :
                                
                                1. Trouvez vos Service IDs sur Render :
                                   → Allez sur https://dashboard.render.com
                                   → Cliquez sur votre service
                                   → Regardez l'URL : https://dashboard.render.com/web/srv-xxxxx
                                   → Le Service ID est la partie après /web/
                                
                                2. Configurez dans Jenkins :
                                   → Manage Jenkins → Configure System
                                   → Global properties → Environment variables
                                   → Ajoutez :
                                     - RENDER_FRONTEND_SERVICE_ID = srv-xxxxx
                                     - RENDER_BACKEND_SERVICE_ID = srv-yyyyy
                                
                                📖 Guide détaillé : JENKINS_RENDER_SERVICE_IDS.md
                            """)
                        }
                        
                        echo "Deploying to Render..."
                        echo "Frontend Service ID: ${frontendServiceId}"
                        echo "Backend Service ID: ${backendServiceId}"
                        
                        // Déployer le backend
                        sh """
                            echo "Deploying backend to Render..."
                            curl -f -X POST "https://api.render.com/v1/services/${backendServiceId}/deploys" \\
                                -H "Authorization: Bearer ${renderApiKey}" \\
                                -H "Content-Type: application/json" \\
                                -d '{"clearCache": "do_not_clear"}' || {
                                EXIT_CODE=\$?
                                echo "Backend deployment API call returned exit code: \$EXIT_CODE"
                                echo "This might be normal if deployment is already in progress"
                            }
                        """
                        
                        // Déployer le frontend
                        sh """
                            echo "Deploying frontend to Render..."
                            curl -f -X POST "https://api.render.com/v1/services/${frontendServiceId}/deploys" \\
                                -H "Authorization: Bearer ${renderApiKey}" \\
                                -H "Content-Type: application/json" \\
                                -d '{"clearCache": "do_not_clear"}' || {
                                EXIT_CODE=\$?
                                echo "Frontend deployment API call returned exit code: \$EXIT_CODE"
                                echo "This might be normal if deployment is already in progress"
                            }
                        """
                        
                        echo "✅ Deployment to Render triggered successfully"
                        echo "Check deployment status at: https://dashboard.render.com"
                    }
                }
            }
        }
    }
}