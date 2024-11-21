FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-loan.jar
ENTRYPOINT ["java", "-jar", "./ms-loan.jar"]