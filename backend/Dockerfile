# Dockerfile for the Node.js backend

# Use Node.js 20 Alpine as a lightweight base image
FROM node:20-alpine

# Install curl for healthchecks or testing purposes, then clean cache
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory inside the container
WORKDIR /app

# Copy package manifest first to leverage Docker layer caching
COPY package.json ./

# Install dependencies needed to build and run the Nest application
RUN npm install

# Copy the rest of the backend source code into the container
COPY . .

# Build the application so /app/dist/main.js exists at runtime
RUN npm run build

# Remove devDependencies after the build to keep the image smaller
RUN npm prune --omit=dev

# Expose backend API port
EXPOSE 3000

# Start the backend application
CMD ["node", "dist/main.js"]
