# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies to optimize Docker caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and compile the jar file (skipping tests for speed)
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Create a minimal, secure runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the generated jar from the build stage
COPY --from=build /app/target/QuickLink-Server-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
