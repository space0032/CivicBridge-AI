# Backend Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
# Run tests during build
RUN mvn clean package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Add support for environment variables
ARG DB_URL
ARG DB_USER
ARG DB_PASSWORD
ENV DB_URL=${DB_URL} \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD}

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
