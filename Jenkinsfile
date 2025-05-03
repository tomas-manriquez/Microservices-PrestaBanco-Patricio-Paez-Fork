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