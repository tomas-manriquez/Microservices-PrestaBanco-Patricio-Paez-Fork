pipeline {
            agent any
            environment {
                DOCKER_CREDENTIALS_ID = 'docker-credentials'
                SONAR_TOKEN = credentials('trigger-build-containerd')  // Assuming the token is stored as a Jenkins credential
                DOCKER_REGISTRY = 'tomasmanriquez480'
                // ZAP Configuration
                TARGET_URL = 'http://host.docker.internal:80/' // Replace with your actual target
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
                stage('Build + OWASP Dependency Check'){
                      steps {
                        script {
                          def runCommand = { cmd -> isUnix() ? sh(cmd) : bat(cmd)}
                          def services = [
                            'config-server', 'eureka-server', 'gateway-server',
                            'ms-customer', 'ms-executive', 'ms-loan',
                            'ms-request', 'ms-simulation', 'frontend-ms'
                          ]
                          def buildTasks = services.collectEntries { service ->
                            ["${service}": {
                              dir(service) {
                                if (service == 'frontend-ms') {
                                  runCommand("npm install")
                                  runCommand("npm run build")
                                } else {
                                  runCommand("mvn clean install -DskipTests")
                                }
                              }
                            }]
                          }
                          parallel buildTasks
                        }
                        script {
                          def runCommand = { cmd -> isUnix() ? sh(cmd) : bat(cmd) }
                          def pythonCmd = isUnix() ? "python3" : "python"
                          runCommand("cd config-server && ${pythonCmd} script.py")
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
                                 /opt/homebrew/bin/trivy image ${env.DOCKER_REGISTRY}/${service}:latest \
                                    --severity LOW,MEDIUM,HIGH --exit-code 0 \
                                    --format json -o trivy-${service}.json

                                  /opt/homebrew/bin/trivy image ${env.DOCKER_REGISTRY}/${service}:latest \
                                    --severity CRITICAL --exit-code 0 \
                                    --format json -o trivy-${service}-crit.json

                                  /opt/homebrew/bin/trivy convert --format template \
                                    --template "/opt/homebrew/share/trivy/templates/html.tpl" \
                                    --output trivy-${service}.html trivy-${service}.json

                                  /opt/homebrew/bin/trivy convert --format template \
                                    --template "/opt/homebrew/share/trivy/templates/junit.tpl" \
                                    --output trivy-${service}.xml trivy-${service}.json
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

            stage('Publish Trivy Reports') {
              steps {
                publishHTML(
                  target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: '*/trivy-*.html',
                    reportName: 'Trivy Reports',
                    reportTitles: 'Trivy Scan Results'
                  ]
                )
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
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        sh """
                            /usr/local/bin/docker run --rm \
                              -v '/Users/tomasmanriquez/.jenkins/workspace/devsecops lab3@2:/zap/wrk/:rw' \
                              -t ghcr.io/zaproxy/zaproxy:latest \
                              zap-baseline.py -t ${env.TARGET_URL} -r zap-report.html

                        """
                    }
                }
               post {
                       always {
                           archiveArtifacts artifacts: "${env.REPORT_NAME}", allowEmptyArchive: true
                           publishHTML([
                                 reportDir: '.',                  // relative to workspace
                                 reportFiles: "${env.REPORT_NAME}",
                                 reportName: 'ZAP DAST Report',
                                 alwaysLinkToLastBuild: true,
                                 keepAll: true
                               ])
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