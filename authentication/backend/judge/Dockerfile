# Start from a standard Ubuntu 22.04 image
FROM ubuntu:22.04

# Avoid getting stuck on interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install the compilers we need
RUN apt-get update && \
    apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && \
    # Clean up the package cache to keep the image small
    rm -rf /var/lib/apt/lists/*

# Set a working directory inside the container
WORKDIR /usr/src/app

# A default command for the container
CMD ["/bin/bash"]