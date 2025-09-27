#!/bin/bash

# Perplexity Search API Setup Script
# This script helps you set up the API quickly

set -e

echo "🚀 Setting up Perplexity Search API..."
echo "=====================================\n"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "\n📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Setup environment file
if [ ! -f ".env" ]; then
    echo "\n⚙️ Setting up environment configuration..."
    cp .env.example .env
    echo "✅ Environment file created: .env"
    echo "⚠️  Please edit .env and add your Perplexity API key"
else
    echo "✅ Environment file already exists"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Run tests
echo "\n🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Some tests failed"
    exit 1
fi

echo "\n🎉 Setup completed successfully!"
echo "================================="
echo ""
echo "Next steps:"
echo "1. Edit .env and add your Perplexity API key"
echo "2. Start the server: npm start"
echo "3. Test the API: curl http://localhost:3000/health"
echo ""
echo "Documentation:"
echo "- README.md - Complete usage guide"
echo "- docs/API.md - Detailed API documentation"
echo "- examples/ - Code examples"
echo ""
echo "Happy coding! 🚀"