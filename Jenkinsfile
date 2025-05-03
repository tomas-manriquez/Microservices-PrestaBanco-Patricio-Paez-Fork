pipeline {
    agent any
    tools {
        maven "maven"
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
                        'ms-simulation',
                        'frontend-ms'
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
        // DAST or other stages...
        stage('DAST - OWASP ZAP') {
            steps {
                script {
                    def targets = [
                        'http://localhost:8081', // ms-customer
                        'http://localhost:8082', // ms-executive
                        'http://localhost:8083', // ms-loan
                        'http://localhost:8084', // ms-request
                        'http://localhost:8085'  // ms-simulation
                    ]
                    bat """
                        IF "%ERRORLEVEL%"=="0" (
                            FOR /F %%i IN ('docker images -q ghcr.io/zaproxy/zap-baseline') DO SET IMAGE_ID=%%i
                            IF NOT DEFINED IMAGE_ID docker pull ghcr.io/zaproxy/zap-baseline
                        )
                    """
                    targets.each { targetUrl ->
                        def port = targetUrl.split(':')[2]
                        bat """
                            docker run --rm -v %CD%:/zap/wrk ghcr.io/zaproxy/zap-baseline -t ${targetUrl} -r zap-report-${port}.html
                        """
                    }
                    archiveArtifacts artifacts: 'zap-report-*.html', onlyIfSuccessful: true
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