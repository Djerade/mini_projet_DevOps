pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'frontend'
        BACKEND_IMAGE = 'backend'
    }   
    
    stages {

        stage('Install dependencies') {
            stage('test'){
                steps {
                    sh 'echo "Testing"'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm \
                            -v ${WORKSPACE}/frontend:/app \
                            -w /app \
                            node:20-alpine \
                            npm install
                    '''
                }
            }
        }

        stage('lint frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm \
                            -v ${WORKSPACE}/frontend:/app \
                            -w /app \
                            node:20-alpine \
                            npm run lint
                    '''
                }
            }
        }
        stage('eslint frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm \
                            -v ${WORKSPACE}/frontend:/app \
                            -w /app \
                            node:20-alpine \
                            npm run eslint
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