pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'frontend'
        BACKEND_IMAGE = 'backend'
    }   
    
    stages {

        stage('Install dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                        if ! command -v node &> /dev/null; then
                            echo "ERROR: Node.js is not installed on the Jenkins agent."
                            echo "Please install Node.js 20 or later, or configure Docker to be available."
                            exit 1
                        fi
                        npm install
                    '''
                }
            }
        }

        stage('lint frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }
        stage('eslint frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run eslint'
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