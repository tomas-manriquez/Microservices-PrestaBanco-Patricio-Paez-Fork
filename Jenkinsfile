pipeline {
            agent any
            environment {
                DOCKER_CREDENTIALS_ID = 'docker-credentials'
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
                                            -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                            -Dsonar.coverage.inclusions=**/service/*.java \
                                            -Dsonar.exclusions=**/controller/** \
                                            -Dsonar.externalIssuesReportPaths=target/sonar-pmd-report.json
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
                            // Register QEMU for cross-platform builds on ARM host
                                        sh 'docker run --rm --privileged --platform linux/arm64/v8 tonistiigi/binfmt --install all'

                                        // Create buildx builder
                                        sh 'docker buildx create --use --name multiarch-builder || true'
                                        sh 'docker buildx inspect multiarch-builder --bootstrap'
                            services.each { service ->
                                dir(service) {
                                    //sh 'docker run --rm --privileged multiarch/qemu-user-static --reset -p yes'
                                    //sh 'docker buildx create --use --name multiarch-builder || true'
                                    //sh 'docker buildx use multiarch-builder'
                                    //sh 'docker buildx create --use --name multiarch-builder || true'
                                    //sh 'docker buildx inspect --bootstrap'


                                    sh "docker buildx build --platform linux/amd64 -t tomasmanriquez480/${service}:latest --push ."
                                    withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                                        sh "docker push tomasmanriquez480/${service}:latest"

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
                            sh "docker-compose up -d"
                        }
                    }
                }
                // DAST or other stages...
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