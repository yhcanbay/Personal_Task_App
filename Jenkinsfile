pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'personal_task_app'
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                dir('taskApp') {
                    script {
                        if (isUnix()) {
                            sh 'chmod +x mvnw'
                            sh './mvnw test'
                        } else {
                            bat 'mvnw.cmd test'
                        }
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('taskApp/frontend/Ders_Programi') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci --no-audit --no-fund'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci --no-audit --no-fund'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                script {
                    retry(2) {
                        if (isUnix()) {
                            sh 'docker compose -f $COMPOSE_FILE up -d --build --remove-orphans'
                        } else {
                            bat 'docker compose -f %COMPOSE_FILE% up -d --build --remove-orphans'
                        }
                    }
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose -f $COMPOSE_FILE ps'
                        sh 'curl --fail http://localhost:8080/api/settings'
                    } else {
                        bat 'docker compose -f %COMPOSE_FILE% ps'
                        bat 'powershell -Command "Invoke-WebRequest http://localhost:8080/api/settings -UseBasicParsing | Out-Null"'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker compose -f $COMPOSE_FILE ps || true'
                } else {
                    bat 'docker compose -f %COMPOSE_FILE% ps'
                }
            }
        }
        success {
            echo 'Pipeline basarili: proje test edildi ve Docker uzerinde guncel haliyle ayağa kalkti.'
        }
        failure {
            echo 'Pipeline basarisiz: Jenkins loglarindaki hata adimini kontrol et.'
        }
    }
}
