#!/bin/bash

# Test Installation Script for Activepieces MCP
# This script tests all three deployment methods

set -e

echo "🧪 Testing Activepieces MCP Installation Methods"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo ""
echo "📋 Checking Prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓${NC} Docker installed: $DOCKER_VERSION"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}⚠${NC} Docker not found (optional)"
    DOCKER_AVAILABLE=false
fi

# Test 1: Build from source
echo ""
echo "🔨 Test 1: Building from Source"
echo "--------------------------------"

if [ ! -f "package.json" ]; then
    echo -e "${RED}✗${NC} package.json not found. Run this script from the project root."
    exit 1
fi

echo "Installing dependencies..."
npm install --silent

echo "Building TypeScript..."
npm run build

if [ -f "dist/mcp/index.js" ]; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed - dist/mcp/index.js not found"
    exit 1
fi

# Test 2: Check package.json configuration
echo ""
echo "📦 Test 2: NPM Package Configuration"
echo "-------------------------------------"

# Check bin entry
if grep -q '"activepieces-mcp"' package.json; then
    echo -e "${GREEN}✓${NC} Bin entry configured"
else
    echo -e "${RED}✗${NC} Bin entry missing in package.json"
    exit 1
fi

# Check main entry
if grep -q '"main": "dist/mcp/index.js"' package.json; then
    echo -e "${GREEN}✓${NC} Main entry configured"
else
    echo -e "${RED}✗${NC} Main entry incorrect in package.json"
    exit 1
fi

# Test 3: Docker build (if Docker is available)
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "🐳 Test 3: Docker Build"
    echo "-----------------------"
    
    echo "Building Docker image..."
    docker build -t activepieces-mcp:test . > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Docker image built successfully"
        
        # Check image size
        IMAGE_SIZE=$(docker images activepieces-mcp:test --format "{{.Size}}")
        echo "  Image size: $IMAGE_SIZE"
        
        # Clean up
        docker rmi activepieces-mcp:test > /dev/null 2>&1
    else
        echo -e "${RED}✗${NC} Docker build failed"
        exit 1
    fi
else
    echo ""
    echo "⏭️  Test 3: Docker Build - Skipped (Docker not available)"
fi

# Test 4: TypeScript compilation check
echo ""
echo "🔍 Test 4: TypeScript Type Checking"
echo "------------------------------------"

npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript type checking passed"
else
    echo -e "${RED}✗${NC} TypeScript type checking failed"
    exit 1
fi

# Test 5: File structure validation
echo ""
echo "📁 Test 5: File Structure Validation"
echo "-------------------------------------"

REQUIRED_FILES=(
    "src/api/client.ts"
    "src/mcp/index.ts"
    "src/mcp/server.ts"
    "src/mcp/tools.ts"
    "src/types/activepieces.ts"
    "package.json"
    "tsconfig.json"
    "Dockerfile"
    "docker-compose.yml"
    "README.md"
    ".env.example"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file - MISSING"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "${RED}✗${NC} Some required files are missing"
    exit 1
fi

# Test 6: Documentation check
echo ""
echo "📚 Test 6: Documentation Check"
echo "-------------------------------"

REQUIRED_DOCS=(
    "README.md"
    "DEPLOYMENT.md"
    "QUICKSTART.md"
    "CONTRIBUTING.md"
    "LICENSE"
)

ALL_DOCS_EXIST=true
for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
    else
        echo -e "${RED}✗${NC} $doc - MISSING"
        ALL_DOCS_EXIST=false
    fi
done

if [ "$ALL_DOCS_EXIST" = false ]; then
    echo -e "${RED}✗${NC} Some documentation files are missing"
    exit 1
fi

# Summary
echo ""
echo "================================================"
echo "✅ All Tests Passed!"
echo "================================================"
echo ""
echo "Next Steps:"
echo "1. Set up your .env file with Activepieces credentials"
echo "2. Run 'npm start' to test the server"
echo "3. Configure Claude Desktop (see README.md)"
echo "4. Test with Claude: 'List all my Activepieces flows'"
echo ""
echo "For more information, see:"
echo "  - README.md for general usage"
echo "  - QUICKSTART.md for 5-minute setup"
echo "  - DEPLOYMENT.md for deployment options"
echo ""
