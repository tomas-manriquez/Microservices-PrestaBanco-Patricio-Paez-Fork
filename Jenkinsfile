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
                                bat "mvn sonar:sonar"
                            }
                        }
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
