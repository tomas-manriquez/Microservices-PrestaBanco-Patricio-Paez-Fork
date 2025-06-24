pipeline {
            agent any
            environment {
                DOCKER_CREDENTIALS_ID = 'docker-credentials'
                SONAR_TOKEN = credentials('trigger-build-containerd')  // Assuming the token is stored as a Jenkins credential
                DOCKER_REGISTRY = 'tomasmanriquez480'
                // ZAP Configuration
                TARGET_URL = 'http://127.0.0.1:80/' // Replace with your actual target
                REPORT_NAME = 'zap-report.html'
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
                                                        sh "echo \$DOCKER_PASS | /usr/local/bin/docker login -u \$DOCKER_USER --password-stdin"
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
                                            sh "/usr/local/bin/docker compose down || true"
                                            sh "/usr/local/bin/docker compose pull"
                                            sh "/usr/local/bin/docker compose up config-server -d"
                                            sleep 10
                                            sh "/usr/local/bin/docker compose up -d"
                                        }
                                    }
                                }
                                // DAST or other stages...
                                        stage('DAST with OWASP ZAP') {
                                        steps {
                                                        script {
                                                            sh """
                                                                docker run --rm -v \$(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t ${env.TARGET_URL} -r ${env.REPORT_NAME}
                                                            """
                                                        }
                                                    }
                                                   post {
                                                           always {
                                                               archiveArtifacts artifacts: "${env.REPORT_NAME}", allowEmptyArchive: true
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