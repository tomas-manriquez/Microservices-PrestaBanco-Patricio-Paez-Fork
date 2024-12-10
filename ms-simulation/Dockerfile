FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-simulation.jar
ENTRYPOINT ["java", "-jar", "./ms-simulation.jar"]
