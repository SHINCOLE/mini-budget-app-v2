pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "nextjs-budget-app"
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Source') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[ 
                        url: 'https://github.com/SHINCOLE/mini-budget-app-v2.git' 
                    ]]
                ])
            }
        }

        stage('Prepare Environment File') {
            steps {
                withCredentials([file(credentialsId: 'envfile', variable: 'ENV_FILE')]) {
                    sh '''
                        echo "Copying environment file..."
                        cp $ENV_FILE .env
                        cp $ENV_FILE .env.local
                        chmod 600 .env .env.local
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker compose build --no-cache
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    echo "Deploying..."
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Waiting for app to start..."
                    sleep 12

                    def status = sh(
                        script: 'curl -I -s http://localhost:3000 | head -n 1 | awk "{print \\$2}"',
                        returnStdout: true
                    ).trim()

                    echo "HTTP Status: ${status}"

                    if (!(status in ["200","301","302","307"])) {
                        error("Health check failed → HTTP ${status}")
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment succeeded!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}