#!/bin/bash

# Run script for PrepAI project
# This script starts the Next.js application in production mode

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting PrepAI application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js before running this script."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm before running this script."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check if the build exists
if [ ! -d "out" ]; then
    echo "Build directory not found. Please run build.sh first."
    exit 1
fi

# Start the application in production mode
echo "Starting application in production mode..."
npm start