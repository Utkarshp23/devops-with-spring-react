# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY react-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY react-app/ ./

# Build the React application
RUN npm run build

# Serve the React application
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000
