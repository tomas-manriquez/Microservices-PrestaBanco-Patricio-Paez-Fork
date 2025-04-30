pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        SONARQUBE_ENV = 'SonarLocal'
        DOCKER_REGISTRY = 'niptuss'
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
                        'ms-simulation'
                    ]
                    services.each { service ->
                        dir(service) {
                            bat "mvn clean install -DskipTests"
                        }
                    }
                }
            }
        }
        stage('Docker Build and Push') {
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
                            bat "docker build -t ${env.DOCKER_REGISTRY}/${service}:latest ."
                            withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                                bat "docker push ${env.DOCKER_REGISTRY}/${service}:latest"
                            }
                        }
                    }
                }
            }
        }
        stage('Run Docker Containers') {
            steps {
                script {
                    bat "docker network create prestabanco-network || true"
                    def services = [
                        [name: 'config-server', port: '8888'],
                        [name: 'eureka-server', port: '8761'],
                        [name: 'gateway-server', port: '8080'],
                        [name: 'ms-customer', port: '8081'],
                        [name: 'ms-executive', port: '8082'],
                        [name: 'ms-loan', port: '8083'],
                        [name: 'ms-request', port: '8084'],
                        [name: 'ms-simulation', port: '8085']
                    ]
                    services.each { service ->
                        bat "docker run -d --name ${service.name} -p ${service.port}:${service.port} ${env.DOCKER_REGISTRY}/${service.name}:latest"
                    }
                }
            }
        }
        stage('OWASP ZAP DAST') {
            steps {
                script {
                    def targetUrls = [
                        'http://localhost:8081',
                        'http://localhost:8082',
                        'http://localhost:8083',
                        'http://localhost:8084',
                        'http://localhost:8085'
                    ]
                    targetUrls.each { url ->
                        bat "zap.sh -cmd -quickurl ${url} -quickout zap_report_${url.replace('http://localhost:', '')}.html"
                    }
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