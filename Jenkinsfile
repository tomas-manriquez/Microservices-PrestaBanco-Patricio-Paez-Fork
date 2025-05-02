pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        SONARQUBE_ENV = 'SonarQube-Local'
        DOCKER_REGISTRY = 'mahirolyuvob'
        DOCKER_CREDENTIALS_ID = 'docker-credentials '
    }
    stages {
        stage('Check') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                script {
                    def services = [
                        'config-server',
                        'eureka-server',
                        'gateway-server',
                        'ms-customer',
                        'ms-executive',
                        'ms-loan',
                        'ms-request',
                        'ms-simulation',
                        'frontend-ms'
                    ]
                    services.each { service ->
                        dir(service) {
                            if (service == 'frontend-ms') {
                                bat "npm install"
                                bat "npm run build"
                            } else {
                                bat "mvn clean install -DskipTests"
                            }
                        }
                    }
                }
            }
        }
        stage('PMD Analysis') {
            steps {
                script {
                    def services = [
                        'config-server',
                        'eureka-server',
                        'gateway-server',
                        'ms-customer',
                        'ms-executive',
                        'ms-loan',
                        'ms-request',
                        'ms-simulation'
                    ]
                    services.each { service ->
                        dir(service) {
                            bat "mvn pmd:pmd"
                            bat 'python %WORKSPACE%\\PMD_TO_SQ.py'
                        }
                    }
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE_ENV}") {
                    script {
                        def services = [
                            'config-server',
                            'eureka-server',
                            'gateway-server',
                            'ms-customer',
                            'ms-executive',
                            'ms-loan',
                            'ms-request',
                            'ms-simulation'
                        ]
                        services.each { service ->
                            dir(service) {
                                bat "mvn sonar:sonar -Dsonar.externalIssuesReportPaths=target/sonar-pmd-report.json"
                            }
                        }
                    }
                }
            }
        }
        // DAST or other stages...
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