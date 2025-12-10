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
                script {
                    // Stop existing containers if running
                    sh '''
                        docker stop frontend-container 2>/dev/null || true
                        docker rm frontend-container 2>/dev/null || true
                        docker stop backend-container 2>/dev/null || true
                        docker rm backend-container 2>/dev/null || true
                    '''
                    // Run containers in background
                    sh 'docker run -d --name frontend-container -p 3000:3000 ${FRONTEND_IMAGE}'
                    sh 'docker run -d --name backend-container -p 8000:8000 ${BACKEND_IMAGE}'
                    // Wait a bit and check if containers are running
                    sh '''
                        sleep 5
                        docker ps | grep -E "(frontend-container|backend-container)" || echo "Containers may have failed to start"
                    '''
                }
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