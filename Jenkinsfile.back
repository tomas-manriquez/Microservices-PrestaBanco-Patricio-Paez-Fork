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
                    // Pull una sola vez
                    bat "docker pull ghcr.io/zaproxy/zaproxy:stable"

                    def targets = [
                        'http://ms-customer:8081', // ms-customer
                        'http://ms-executive:8082', // ms-executive
                        'http://ms-loan:8083', // ms-loan
                        'http://ms-request:8084', // ms-request
                        'http://ms-simulation:8085'  // ms-simulation
                    ]

                    targets.each { targetUrl ->
                        def port = targetUrl.split(':')[2]
                        bat """
                            docker run --rm --network=microservicios-prestabanco \
                              -v %CD%:/zap/wrk \
                              ghcr.io/zaproxy/zaproxy:stable \
                              zap-baseline.py -t ${targetUrl} -r zap-report-${port}.html
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