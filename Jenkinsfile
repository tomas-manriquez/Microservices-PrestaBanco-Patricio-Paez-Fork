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
                    bat "docker-compose down || exit 0"
                    bat "docker-compose up -d"
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