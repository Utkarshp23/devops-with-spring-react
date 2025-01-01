# Project Setup Guide

This guide explains how to set up Java, Spring Boot, and Maven in Visual Studio Code (VS Code) for the current project.

## Prerequisites

- Java Development Kit (JDK) 11 or higher
- Apache Maven
- Visual Studio Code
- Java Extension Pack for VS Code
- Spring Boot Extension Pack for VS Code
- Docker

## Steps

### 1. Install JDK

Ensure that JDK 11 or higher is installed on your system. You can download it from the [official Oracle website](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or use a package manager like `sdkman`.

### 2. Install Apache Maven

#### a. Download and Install Maven

- Go to the [Maven download page](https://maven.apache.org/download.cgi).
- Download the binary zip archive for your operating system.
- Extract the archive to a directory, e.g., `C:\Program Files\Apache\Maven` on Windows or `/usr/local/apache-maven` on macOS/Linux.

#### b. Set Up Environment Variables

##### On Windows

1. Open the Start Search, type in "env", and select "Edit the system environment variables".
2. In the System Properties window, click on the "Environment Variables" button.
3. Under "System variables", click "New" and add `MAVEN_HOME` with the path to your Maven directory, e.g., `C:\Program Files\Apache\Maven`.
4. Find the `Path` variable in the "System variables" section, select it, and click "Edit".
5. Click "New" and add `%MAVEN_HOME%\bin`.
6. Click "OK" to close all windows.

##### On macOS/Linux

1. Open a terminal.
2. Edit your shell profile file (e.g., `~/.bashrc`, `~/.zshrc`, or `~/.profile`) and add the following lines:

```sh
export MAVEN_HOME=/path/to/your/maven
export PATH=$MAVEN_HOME/bin:$PATH
```

3. Save the file and run `source ~/.bashrc` (or the appropriate file) to apply the changes.

#### c. Verify Maven Installation

Open a new terminal and run:

```sh
mvn -version
```

You should see output indicating the Maven version and Java version.

### 3. Install Visual Studio Code

Download and install VS Code from the [official website](https://code.visualstudio.com/).

### 4. Install Java Extension Pack

In VS Code, go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`. Search for "Java Extension Pack" and install it.

### 5. Install Spring Boot Extension Pack

In VS Code, go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`. Search for "Spring Boot Extension Pack" and install it.

### 6. Configure the Project

#### a. Application Properties

Ensure your `application.properties` file is configured to log to the console:

```properties
// filepath: /u:/Devops/spring-docker/dock/src/main/resources/application.properties
spring.application.name=dock
logging.level.root=INFO
logging.level.org.springframework.web=DEBUG
logging.file.name=
```

#### b. Launch Configuration

Create or update the `launch.json` file in the `.vscode` directory to include configurations for running your Spring Boot application:

```jsonc
// filepath: /u:/Devops/spring-docker/dock/.vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
        "type": "java",
        "name": "Debug Spring Boot",
        "request": "launch",
        "cwd": "${workspaceFolder}",
        "mainClass": "com.dock.dock.DockApplication",
        "projectName": "dock",
        "console": "integratedTerminal"
    },
    {
        "type": "java",
        "name": "Spring Boot-DockApplication<dock>",
        "request": "launch",
        "cwd": "${workspaceFolder}",
        "mainClass": "com.dock.dock.DockApplication",
        "projectName": "dock",
        "args": "",
        "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

### 7. Create a Simple Controller

Create a simple controller to test your Spring Boot application:

```java
// filepath: /u:/Devops/spring-docker/dock/src/main/java/com/dock/dock/controller/TestController.java
package com.dock.dock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Hello, World!";
    }
}
```

### 8. Run the Application

You can run the application using the Spring Dashboard plugin in VS Code or by using the debug configurations defined in `launch.json`. This will keep the terminal open and display the logs continuously.

### 9. Access the Application

Open your web browser and navigate to `http://localhost:8080/test` to see the "Hello, World!" message from the test controller.

### 10. Generate the JAR File

To generate the JAR file for your Spring Boot application, run the following Maven command:

```sh
cd /u:/Devops/spring-docker/dock
mvn clean package
```

This will create a JAR file in the `target` directory.

### 11. Containerize the Application

#### a. Create a Dockerfile

Create a `Dockerfile` in the root of your project directory:

```Dockerfile
// filepath: /u:/Devops/spring-docker/dock/Dockerfile
# Use an official JDK runtime as a parent image
FROM openjdk:11-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the project JAR file into the container at /app
COPY target/*.jar app.jar

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### b. Build the Docker Image

Navigate to the root of your project directory and build the Docker image using the following command:

```sh
docker build -t spring-boot-app .
```

#### c. Run the Docker Container

Run the Docker container using the following command:

```sh
docker run -p 8080:8080 spring-boot-app
```

This will build and run your Spring Boot application inside a Docker container, making it accessible on port 8080.

## Additional Resources

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/html/)
- [Visual Studio Code Java Documentation](https://code.visualstudio.com/docs/languages/java)
- [Docker Documentation](https://docs.docker.com/)
