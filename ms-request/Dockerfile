FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-request.jar
ENTRYPOINT ["java", "-jar", "./ms-request.jar"]