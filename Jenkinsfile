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
                        'ms-customer'
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
                        'ms-customer'
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
                    def services = [
                        [name: 'config-server', port: '8888'],
                        [name: 'eureka-server', port: '8761'],
                        [name: 'gateway-server', port: '8080'],
                        [name: 'ms-customer', port: '8081']
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
                        'http://localhost:8081'
                    ]
                    targetUrls.each { url ->
                        bat """
                            cd /d C:\\ZAP && java -Xmx2048m -jar zap-2.16.0.jar -cmd ^
                            -quickurl ${url} ^
                            -quickout %WORKSPACE%\\zap-report-${url}.html ^
                            -quickprogress ^
                            -config ascan.threadPerHost=2 ^
                            -config ascan.maxRuleDurationInMins=5 ^
                            -config ascan.maxScanDurationInMins=2
                        """
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