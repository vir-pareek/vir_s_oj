# Use the Node.js 18 Bullseye image as the base image
FROM node:18-bullseye

# Set the working directory inside the container
WORKDIR /app

# Install GCC and other necessary build tools
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    build-essential \
    g++ \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only the package.json and package-lock.json files and install dependencies.
# This allows Docker to cache this layer when package files don't change.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
# Copy the rest of the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

EXPOSE 8000

# Specify the command to run when the container starts
CMD [ "node", "index.js" ]