#!/bin/bash

echo "🚀 TradeOS Master Development Runner"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo -e "${YELLOW}Please run ./setup.sh first${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed!${NC}"
    echo -e "${YELLOW}Please run ./install.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment ready${NC}"
echo ""

echo -e "${BLUE}Starting all applications in parallel...${NC}"
echo ""
echo "Applications:"
echo "  📱 Mobile (Expo): http://localhost:8081"
echo "  🌐 Web Admin (Next.js): http://localhost:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all applications${NC}"
echo ""

# Run all apps using turbo
pnpm turbo run dev --parallel

# Cleanup message
echo ""
echo -e "${GREEN}All applications stopped.${NC}"
