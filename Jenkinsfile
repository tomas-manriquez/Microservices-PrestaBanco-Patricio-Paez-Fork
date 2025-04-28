def getPortFromLog = { String logPath ->
    def logText = readFile(file: logPath)
    def matcher = logText =~ /Tomcat started on port\(s\): (\d+)/
    if (matcher.find()) {
        return matcher[0][1]
    } else {
        error "No se pudo detectar el puerto en el log: ${logPath}"
    }
}

def targetServices = ['ms-customer']

pipeline {
    agent any
    tools {
        maven "maven"
    }
    environment {
        SONARQUBE_ENV = 'SonarLocal'
        CONFIG_SERVER_LOCATION = 'http://localhost:8888'
        SERVER_PORT = '0'
        EUREKA_SERVER_URL = 'http://localhost:8761/eureka/'
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
        stage('Start Infra Services') {
            steps {
                script {
                    def configServerUrl = "http://localhost:8888" // Replace with your config-server URL
                    def infraServices = ['config-server', 'eureka-server', 'gateway-server']
                    infraServices.each { service ->
                        dir(service) {
                            bat "start /B mvn spring-boot:run > ${service}.log 2>&1"
                        }
                        echo "Waiting ${service}..."
                        sleep time: 10, unit: 'SECONDS'
                    }
                }
            }
        }
        stage('Start Target Services') {
            steps {
                script {
                    targetServices.each { service ->
                        dir(service) {
                            bat """
                                start /B mvn spring-boot:run ^
                                -Dspring.cloud.config.uri=${env.CONFIG_SERVER_LOCATION} ^
                                -Deureka.client.service-url.defaultZone=${env.EUREKA_SERVER_URL} ^
                                -Dserver.port=${env.SERVER_PORT} > ${service}.log 2>&1
                            """
                        }
                        echo "Waiting ${service}..."
                        sleep time: 20, unit: 'SECONDS'
                    }
                }
            }
        }
        stage('OWASP ZAP') {
            steps {
                script {
                    def puertos = []
                    targetServices.each { service ->
                        dir(service) {
                            def logPath = "${service}.log"
                            def port = getPortFromLog(logPath)
                            echo "Port of ${service}: ${port}"
                            puertos.add(port)
                        }
                    }

                    puertos.each { port ->
                        bat """
                            cd /d C:\\ZAP && java -Xmx8192m -jar zap-2.16.0.jar -cmd ^
                            -quickurl http://localhost:${port} ^
                            -quickout %WORKSPACE%\\zap-report-${port}.html ^
                            -quickprogress ^
                            -config ascan.threadPerHost=2 ^
                            -config ascan.maxRuleDurationInMins=5 ^
                            -config ascan.maxScanDurationInMins=2
                        """
                    }
                }

                archiveArtifacts artifacts: 'zap-report-*.html', allowEmptyArchive: true
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
