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
        stage('Start Services') {
            steps {
                dir ('config-server') {
                    // Ejecuta el config-server en segundo plano
                    bat "start /B mvn spring-boot:run"
                }
                // Espera unos segundos para que el config-server arranque
                echo "Esperando a que el config-server esté disponible..."
                sleep time: 20, unit: 'SECONDS'

                dir ('eureka-server') {
                    // Ejecuta el eureka-server en segundo plano
                    bat "start /B mvn spring-boot:run"
                }
                // Espera unos segundos para que el eureka-server arranque
                echo "Esperando a que el eureka-server esté disponible..."
                sleep time: 20, unit: 'SECONDS'

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
                    bat 'cd /d C:\\ZAP && java -Xmx8192m -jar zap-2.16.0.jar -cmd -quickurl http://localhost:8080 -quickout %WORKSPACE%\\zap-report.html -quickprogress -quickexclude ".*(logout|export|download|actuator|h2-console).*" -config ascan.threadPerHost=2 -config ascan.maxRuleDurationInMins=5 -config ascan.maxScanDurationInMins=1'
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
