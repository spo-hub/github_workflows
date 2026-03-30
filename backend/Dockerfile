# ================================
# Stage 1: Build the Kontlin/Java application
# ================================

ARG JAVA_JDK_VERSION=21-jdk-alpine3.23-dev
ARG JAVA_JRE_VERSION=21-alpine3.23-dev
ARG KOTLIN_VERSION=

FROM dhi.io/eclipse-temurin:${JAVA_JDK_VERSION} AS builder

WORKDIR /app

# Copy Gradle wrapper adn build files
COPY gradlew .
COPY gradle gradle/
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Download dependencies (cached layer if build files don't change)
RUN ./gradlew dependencies --no-daemon || true

COPY src src/

# Build the JAR (skip test for faster builds)
RUN ./gradlew bootJar --no-daemon -x test

# ================================
# Stage 2: Runtime - Run the application
# ================================
FROM dhi.io/eclipse-temurin:${JAVA_JRE_VERSION} AS runner

WORKDIR /app

# Copy the JAR from builder stage 
COPY --from=builder /app/build/libs/*.jar app.jar


# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT [ "java", "-jar", "app.jar" ]