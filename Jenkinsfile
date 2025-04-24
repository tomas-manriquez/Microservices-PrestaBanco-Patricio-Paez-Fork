pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        GITHUB_TOKEN = '33ff7af5-264a-4e8c-8b5e-f2000831c9cc'
        SONARQUBE_ENV = 'localhost:9000'
    }
    stages {
        stage('Check') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                bat 'mvn clean install'
            }
        }
        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }
        stage('SAST - SonarQube') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE_ENV}") {
                    bat 'mvn sonar:sonar'
                    // o bat 'sonar-scanner' si no usas Maven
                }
            }
        }
        stage('PMD Analysis') {
            steps {
                script {
                    // Realiza el análisis con PMD
                    bat 'mvn pmd:check'
                }
            }
        }
    }
    post {
        failure {
            echo 'Error in pipeline.'
        }
        success {
            echo 'Pipeline completed.'
        }
    }
}