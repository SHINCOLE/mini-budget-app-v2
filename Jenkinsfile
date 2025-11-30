pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "nextjs-budget-app"
    }

    stages {

        // -------------------------
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        // -------------------------
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

        // -------------------------
        stage('Prepare Environment File') {
            steps {
                withCredentials([file(credentialsId: 'envfile', variable: 'ENV_FILE')]) {
                    sh '''
                        echo "Copying environment file..."
                        cp $ENV_FILE .env
                        cp $ENV_FILE .env.local
                        ls -la
                    '''
                }
            }
        }

        // -------------------------
        stage('Build Docker Image') {
            steps {
                retry(2) {
                    sh 'sudo docker compose build --no-cache'
                }
            }
        }

        // -------------------------
        stage('Deploy Application') {
            steps {
                sh 'sudo docker compose down || true'
                sh 'sudo docker compose up -d'
            }
        }

        // -------------------------
        stage("Health Check") {
            steps {
                script {
                    sleep 10  // give container time to boot

                    def status = sh(
                        script: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:3000",
                        returnStdout: true
                    ).trim()

                    if (status != "200" && status != "304") {
                        error("❌ Health check failed (status: ${status})")
                    }
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment succeeded!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}