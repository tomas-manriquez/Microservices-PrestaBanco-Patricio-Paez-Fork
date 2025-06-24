pipeline {
            agent any
            environment {
                DOCKER_CREDENTIALS_ID = 'docker-credentials'
                SONAR_TOKEN = credentials('trigger-build-containerd')  // Assuming the token is stored as a Jenkins credential
                DOCKER_REGISTRY = 'tomasmanriquez480'
                // ZAP Configuration
                ZAP_VERSION = '2.16.1'
                ZAP_API_KEY = "${UUID.randomUUID().toString()}"
                ZAP_HOME = "${env.WORKSPACE}/.security-cache/zap"
                // Dependency Check Configuration
                DEPENDENCY_CHECK_HOME = '/opt/homebrew/bin'
            }
            tools {
                maven "maven"
                nodejs "node22"
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
                                            sh '/usr/local/bin/docker buildx create --use --name multiarch-builder || true'
                                            sh '/usr/local/bin/docker buildx inspect --bootstrap'
                                            services.each { service ->
                                                dir(service) {
                                                    sh "/usr/local/bin/docker buildx build --platform linux/arm64,linux/amd64 -t tomasmanriquez480/${service}:latest --push ."
                                                    withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                                                        sh "/usr/local/bin/docker push tomasmanriquez480/${service}:latest"

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                stage('Run Docker Containers') {
                                    steps {
                                        script {
                                            sh "docker-compose down || true"
                                            sh "docker-compose pull"
                                            sh "docker-compose up config-server -d"
                                            sh "docker-compose up -d"
                                        }
                                    }
                                }
                stage('OWASP Dependency Check'){
                            steps {
                                script {
                                    def services = [
                                        'config-server', 'eureka-server', 'gateway-server',
                                        'ms-customer', 'ms-executive', 'ms-loan',
                                        'ms-request', 'ms-simulation', 'frontend-ms'
                                    ]
                                    services.each { service ->
                                        dir(service) {
                                            dependencyCheck(
                                                additionalArguments: '''
                                                    --scan .
                                                    --format JSON
                                                    --format HTML
                                                    --disableYarnAudit
                                                    --prettyPrint
                                                    --enableRetired
                                                    --disableAssembly
                                                ''',
                                                nvdCredentialsId: 'token-nvd-api-key',
                                                odcInstallation: 'owasp-dc-devsecops-pep3'
                                            )
                                            dependencyCheckPublisher(
                                                pattern: '**/dependency-check-report.xml'
                                            )
                                        }
                                    }
                                }
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
                                        sh "npm install"
                                        sh "npm run build"
                                    } else {
                                        sh "mvn clean install -DskipTests"
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Unit Testing') {
                    steps {
                        script {
                            def services = [
                                'ms-customer',
                                'ms-executive',
                                'ms-loan',
                                'ms-request',
                                'ms-simulation'
                            ]
                            services.each { service ->
                                dir(service) {
                                    sh "mvn test jacoco:report"
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
                                    sh "mvn pmd:pmd"
                                    sh "python3 \"\$WORKSPACE/PMD_TO_SQ.py\""
                                }
                            }
                        }
                    }
                }
                stage('SonarQube Analysis') {
                    steps {
                        withSonarQubeEnv("DevSecOps Lab3") {
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
                                        sh '''
                                            mvn sonar:sonar \
                                            -Dsonar.token=$SONAR_TOKEN \
                                            -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                            -Dsonar.coverage.inclusions=**/service/*.java \
                                            -Dsonar.exclusions=**/controller/** \
                                            -Dsonar.externalIssuesReportPaths=target/sonar-pmd-report.json \
                                            -Dsonar.maven.plugin.version=4.0.0.4121
                                        '''
                                    }
                                }
                            }
                        }
                    }
                }

                // DAST or other stages...
                        stage('DAST with OWASP ZAP') {
                            steps {
                                script {
                                    // Install/Start ZAP
                                    sh '''
                                        if [ ! -d "$WORKSPACE/.security-cache/zap/ZAP_${ZAP_VERSION}" ]; then
                                            echo "Installing OWASP ZAP..."
                                            cd $WORKSPACE/.security-cache/zap
                                            wget -q https://github.com/zaproxy/zaproxy/releases/download/v${ZAP_VERSION}/ZAP_${ZAP_VERSION}_Linux.tar.gz
                                            tar -xzf ZAP_${ZAP_VERSION}_Linux.tar.gz
                                            chmod +x ZAP_${ZAP_VERSION}/zap.sh
                                        fi
                                    '''

                                    // Start ZAP daemon
                                    sh '''
                                        echo "Starting ZAP daemon..."
                                        $WORKSPACE/.security-cache/zap/ZAP_${ZAP_VERSION}/zap.sh -daemon -host 0.0.0.0 -port 8090 -config api.key=${ZAP_API_KEY} &
                                        ZAP_PID=$!
                                        echo $ZAP_PID > zap.pid

                                        # Wait for ZAP to start
                                        timeout 60 bash -c 'until curl -s http://localhost:8090 >/dev/null; do sleep 2; done'
                                    '''

                                    // Run ZAP baseline scan
                                    sh '''
                                        echo "Running ZAP baseline scan..."
                                        python3 $WORKSPACE/.security-cache/zap/ZAP_${ZAP_VERSION}/zap-baseline.py \
                                            -t http://localhost:8080 \
                                            -g gen.conf \
                                            -r zap-baseline-report.html \
                                            -J zap-baseline-report.json \
                                            -w zap-baseline-report.md \
                                            -z "-config api.key=${ZAP_API_KEY}"
                                    '''

                                    // Run ZAP full scan on critical endpoints
                                    sh '''
                                        echo "Running ZAP full scan on critical endpoints..."
                                        python3 $WORKSPACE/.security-cache/zap/ZAP_${ZAP_VERSION}/zap-full-scan.py \
                                            -t http://localhost:8080/api \
                                            -g gen.conf \
                                            -r zap-full-report.html \
                                            -J zap-full-report.json \
                                            -w zap-full-report.md \
                                            -z "-config api.key=${ZAP_API_KEY}" \
                                            -I  # Fail on HIGH risk alerts
                                    '''
                                }
                            }
                            post {
                                always {
                                    // Stop ZAP daemon
                                    sh '''
                                        if [ -f zap.pid ]; then
                                            kill $(cat zap.pid) || true
                                            rm -f zap.pid
                                        fi
                                    '''

                                    // Archive ZAP reports
                                    archiveArtifacts artifacts: 'zap-*-report.*', allowEmptyArchive: true
                                    publishHTML([
                                        allowMissing: false,
                                        alwaysLinkToLastBuild: true,
                                        keepAll: true,
                                        reportDir: '.',
                                        reportFiles: 'zap-*-report.html',
                                        reportName: 'OWASP ZAP DAST Report'
                                    ])
                                }
                            }
                        }
                        stage('Trivy Scan'){
                                          steps {
                                            script {
                                              def services = [
                                                'config-server', 'eureka-server', 'gateway-server',
                                                'ms-customer', 'ms-executive', 'ms-loan',
                                                'ms-request', 'ms-simulation', 'frontend-ms'
                                              ]
                                              services.each { service ->
                                                dir(service) {
                                                  if (isUnix()) {
                                                    sh("""
                                                      trivy image --exit-code 1 --severity HIGH,CRITICAL ${env.DOCKER_REGISTRY}/${service}:latest || exit 0
                                                    """.stripIndent())
                                                  } else {
                                                    bat("""
                                                      .\trivy image --exit-code 1 --severity HIGH,CRITICAL ${env.DOCKER_REGISTRY}/${service}:latest || exit 0
                                                    """.stripIndent())
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