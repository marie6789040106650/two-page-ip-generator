#!/bin/bash

# Deployment script for Two-Page IP Generator
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="two-page-ip-generator"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo "📋 Loading environment variables from .env.$ENVIRONMENT"
    export $(cat .env.$ENVIRONMENT | xargs)
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run type checking
echo "🔍 Running type checking..."
pnpm run type-check

# Run linting
echo "🔍 Running linting..."
pnpm run lint

# Run tests
echo "🧪 Running tests..."
pnpm run test:run

# Build the application
echo "🏗️ Building application..."
pnpm run build:production

# Docker deployment (if Docker is available)
if command -v docker &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker build -t $PROJECT_NAME:$ENVIRONMENT .
    
    # Tag for latest if production
    if [ "$ENVIRONMENT" = "production" ]; then
        docker tag $PROJECT_NAME:$ENVIRONMENT $PROJECT_NAME:latest
    fi
    
    echo "✅ Docker image built successfully"
fi

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo "🏥 Performing health check on $url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s $url > /dev/null; then
            echo "✅ Health check passed"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts failed, retrying in 5 seconds..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Start the application (for local deployment)
if [ "$ENVIRONMENT" = "local" ]; then
    echo "🚀 Starting application locally..."
    pnpm start &
    
    # Wait for the application to start
    sleep 10
    
    # Perform health check
    if health_check "http://localhost:3000"; then
        echo "✅ Local deployment successful"
    else
        echo "❌ Local deployment failed"
        exit 1
    fi
fi

echo "🎉 Deployment completed successfully for environment: $ENVIRONMENT"

# Post-deployment notifications (customize as needed)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "📧 Sending deployment notification..."
    # Add your notification logic here (Slack, email, etc.)
fi