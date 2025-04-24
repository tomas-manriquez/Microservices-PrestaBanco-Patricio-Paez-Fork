pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        SONARQUBE_ENV = 'SonarLocal'
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
        stage('Start Gateway') {
            steps {
                dir('gateway-server') {
                    // Ejecuta el gateway en segundo plano
                    bat "start /B mvn spring-boot:run"
                }

                // Espera unos segundos para que el gateway arranque
                echo "Esperando a que el gateway esté disponible..."
                sleep time: 20, unit: 'SECONDS'
            }
        }
        stage('OWASP ZAP') {
            steps {
                script {
                    bat '"C:\\ZAP\\zap.bat" -cmd -quickurl http://localhost:8080 -quickout %WORKSPACE%\\zap-report.html -quickprogress'
                }
                archiveArtifacts artifacts: 'zap-report.html', allowEmptyArchive: true
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
