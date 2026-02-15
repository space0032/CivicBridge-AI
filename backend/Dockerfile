# Backend Dockerfile with Layer Optimization

# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only dependency file first (to cache dependencies)
COPY pom.xml .

# Download dependencies (this layer will be cached unless pom.xml changes)
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# Add support for environment variables
ARG DB_URL
ARG DB_USER
ARG DB_PASSWORD
ENV DB_URL=${DB_URL} \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD}

# Copy the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
