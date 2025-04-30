pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        SONARQUBE_ENV = 'SonarLocal'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
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
                                bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS% ${env.DOCKER_REGISTRY}"
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
                        bat "docker run -d --name ${service} -p 8080:8080 ${env.DOCKER_REGISTRY}/${service}:latest"
                    }
                }
            }
        }
        stage('OWASP ZAP DAST') {
            steps {
                script {
                    def targetUrls = [
                        'http://localhost:8080',
                        'http://localhost:8081',
                        'http://localhost:8082',
                        'http://localhost:8083',
                        'http://localhost:8084',
                        'http://localhost:8085'
                    ]
                    targetUrls.each { url ->
                        bat "zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' ${url}"
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