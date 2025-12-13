pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "${env.DOCKERHUB_USERNAME}"
        DOCKERHUB_PASSWORD = "${env.DOCKERHUB_PASSWORD}"
        FRONTEND_IMAGE = 'parfi7zhy/frontend'
        BACKEND_IMAGE = 'parfi7zhy/backend'
        SONAR_HOST_URL = 'https://sonarcloud.io'
    }   
    
    stages {
        stage('Init workspace paths') {
            steps {
                script {
                    env.HOST_WORKSPACE = "/home/perfect/Documents/GitHub/mini_projet_DevOps/jenkins/workspace/${env.JOB_NAME}"
                    echo "Host workspace path: ${env.HOST_WORKSPACE}"
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
                        
                        echo "Starting SonarQube scan..."
                        echo "SONAR_HOST_URL: ${SONAR_HOST_URL}"
                        echo "Project Key: mini_projet_frontend"
                        
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
                          -Dsonar.projectKey=mini_projet_frontend \
                          -Dsonar.projectName=mini_projet_frontend \
                          -Dsonar.sources=. \
                          ${COVERAGE_OPTION} || {
                            EXIT_CODE=$?
                            echo "ERROR: SonarQube scan failed with exit code: $EXIT_CODE"
                            echo "Please check:"
                            echo "  1. Project exists in SonarCloud with key 'mini_projet_frontend'"
                            echo "  2. Token has correct permissions"
                            echo "  3. Project key matches exactly in SonarCloud"
                            exit 0
                          }
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE} frontend'
                sh 'docker build -t ${BACKEND_IMAGE} backend'
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
                sh 'docker compose up -d'
            }
        }
    }
}