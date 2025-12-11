pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'parfi7zhy '
        DOCKERHUB_PASSWORD = 'Docker@123'
        FRONTEND_IMAGE = 'dockerhub.io/parfi7zhy/frontend'
        BACKEND_IMAGE = 'dockerhub.io/parfi7zhy/backend'
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

        stage('test') {
            steps {
                sh 'echo "Testing"'
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
        stage('Build') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE} frontend'
                sh 'docker build -t ${BACKEND_IMAGE} backend'
            }
        }
        
     stage('Push') {
         steps {
       withCredentials([usernamePassword(credentialsId: 'parfi7zhy', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
         sh '''
           echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
           docker push ${FRONTEND_IMAGE}
           docker push ${BACKEND_IMAGE}
         '''
              }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}