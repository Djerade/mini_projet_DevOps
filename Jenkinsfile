pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'frontend'
        BACKEND_IMAGE = 'backend'
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
        stage('Run') {
            steps {
                sh 'docker run -p 3000:3000 ${FRONTEND_IMAGE}'
                sh 'docker run -p 8000:8000 ${BACKEND_IMAGE}'
            }
        }
        stage('Push') {
            steps {
                sh 'docker push ${FRONTEND_IMAGE}'
                sh 'docker push ${BACKEND_IMAGE}'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}