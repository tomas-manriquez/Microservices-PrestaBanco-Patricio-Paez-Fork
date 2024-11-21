FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-executive.jar
ENTRYPOINT ["java", "-jar", "./ms-executive.jar"]