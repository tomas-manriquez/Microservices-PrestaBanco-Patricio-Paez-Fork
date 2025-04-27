pipeline {
    agent any

    environment {
        CONFIG_SERVER_LOCATION = "http://localhost:8888"
    }

    stages {
        stage('Build') {
            steps {
                echo "Construyendo el proyecto..."
                bat 'mvn clean install'
            }
        }

        stage('Run ms-customer') {
            steps {
                echo "Levantando el microservicio ms-customer..."

                // Levantamos el microservicio y redireccionamos el log
                bat """
                    cd ms-customer
                    CONFIG_SERVER_LOCATION=${CONFIG_SERVER_LOCATION} mvn spring-boot:run > ms-customer.log 2>&1 &
                    echo $! > ms-customer.pid
                """

                // Esperamos a que levante leyendo el log
                script {
                    def maxRetries = 30
                    def retryInterval = 2 // segundos
                    def portDetected = false

                    for (int i = 0; i < maxRetries; i++) {
                        if (fileExists('ms-customer/ms-customer.log')) {
                            def logContent = readFile('ms-customer/ms-customer.log')
                            def matcher = logContent =~ /Tomcat started on port\\(s\\): (\\d+)/
                            if (matcher.find()) {
                                env.CUSTOMER_PORT = matcher.group(1)
                                echo "Puerto detectado: ${env.CUSTOMER_PORT}"
                                portDetected = true
                                break
                            }
                        }
                        echo "Esperando que el microservicio levante... intento ${i + 1}"
                        sleep retryInterval
                    }

                    if (!portDetected) {
                        error "No se pudo detectar el puerto en el log de ms-customer"
                    }
                }
            }
        }

        stage('Tests') {
            steps {
                echo "Ejecutando tests contra ms-customer en puerto ${env.CUSTOMER_PORT}..."
                bat 'curl -f http://localhost:${CUSTOMER_PORT}/actuator/health'
            }
        }
    }

    post {
        always {
            echo "Deteniendo ms-customer si está corriendo..."
            script {
                if (fileExists('ms-customer/ms-customer.pid')) {
                    def pid = readFile('ms-customer/ms-customer.pid').trim()
                    bat "kill ${pid} || true"
                }
            }
        }
    }
}
