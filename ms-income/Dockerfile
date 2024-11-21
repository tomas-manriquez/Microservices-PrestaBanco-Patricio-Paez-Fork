FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-income.jar
ENTRYPOINT ["java", "-jar", "./ms-income.jar"]