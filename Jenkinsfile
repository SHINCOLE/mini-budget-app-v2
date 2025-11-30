pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "nextjs-budget-app"
        DOCKER_IMAGE = "nextjs-budget-app-app:latest"
    }

    options {
        // Increase pipeline timeout so long builds don't get killed prematurely
        timeout(time: 60, unit: 'MINUTES')
        // Keep build logs for debugging
        buildDiscarder(logRotator(numToKeepStr: '30'))
        ansiColor('xterm')
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
                // envfile must be a Credentials file item
                withCredentials([file(credentialsId: 'envfile', variable: 'ENV_FILE')]) {
                    sh '''
                        echo "Copying environment file..."
                        cp $ENV_FILE .env || true
                        cp $ENV_FILE .env.local || true
                        ls -la
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Use docker-compose build (no sudo). We attempt to use local cache_from image.
                    sh "docker compose build --pull --progress=plain || true"
                    // Also tag image to ensure cache_from works next run
                    sh "docker image inspect ${DOCKER_IMAGE} >/dev/null 2>&1 || true"
                }
            }
        }

        stage('Deploy Application') {
            steps {
                // Stop any existing stack and bring up the new containers
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage("Health Check") {
            steps {
                script {
                    // allow boot time, but not too long; we'll check multiple times
                    def attempts = 10
                    def ok = false
                    for (int i=0; i<attempts; i++) {
                        // follow redirects (-L) and return HTTP code
                        def status = sh(
                            script: "curl -s -o /dev/null -w \"%{http_code}\" -L http://localhost:3000 || true",
                            returnStdout: true
                        ).trim()
                        echo "Health check attempt ${i+1}/${attempts}: ${status}"
                        if (status == '200' || status == '304' || status == '301' || status == '302' || status == '307' || status == '308') {
                            ok = true
                            break
                        }
                        sleep 5
                    }
                    if (!ok) {
                        error("Health check failed after ${attempts} attempts.")
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed!'
            // optional: show docker ps & logs for debugging
            sh 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || true'
            sh 'docker compose logs --tail=200 || true'
        }
    }
}