#!/bin/bash

# Build script for PrepAI project
# This script installs dependencies and builds the Next.js application

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process for PrepAI..."

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

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env.local exists, if not create a template
if [ ! -f .env.local ]; then
    echo "Warning: .env.local file not found. Please create one with your API keys."
    echo "Creating a template .env.local file..."
    cat > .env.local << EOF
# Vapi Public Key (Voice AI)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here

# Vapi Assistant ID
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Google Gemini API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EOF
    echo "Template .env.local file created. Please update it with your actual API keys."
fi

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"
echo "To run the application in production mode, use: npm start"