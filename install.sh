#!/bin/bash

echo "🔧 TradeOS Dependency Installation Guide"
echo "========================================"
echo ""
echo "This script provides guidance for installing required dependencies."
echo "Please run the appropriate commands for your operating system."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    OS="unknown"
fi

echo -e "${BLUE}Detected OS: $OS${NC}"
echo ""

# Node.js
echo "📦 Node.js (v18 or higher)"
echo "-------------------------"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js $(node --version) is installed${NC}"
else
    echo -e "${YELLOW}❌ Node.js not found. Install from:${NC}"
    echo "   https://nodejs.org/ or use nvm:"
    if [[ "$OS" == "macos" || "$OS" == "linux" ]]; then
        echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "   nvm install 18"
    fi
fi
echo ""

# pnpm
echo "📦 pnpm (v9 or higher)"
echo "---------------------"
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓ pnpm $(pnpm --version) is installed${NC}"
else
    echo -e "${YELLOW}❌ pnpm not found. Install with:${NC}"
    echo "   npm install -g pnpm@latest"
    echo "   or"
    echo "   curl -fsSL https://get.pnpm.io/install.sh | sh -"
fi
echo ""

# Expo CLI
echo "📱 Expo CLI (for mobile development)"
echo "-----------------------------------"
if command -v expo &> /dev/null; then
    echo -e "${GREEN}✓ Expo CLI is installed${NC}"
else
    echo -e "${YELLOW}❌ Expo CLI not found. Install with:${NC}"
    echo "   npm install -g expo-cli"
    echo "   or"
    echo "   npx expo-cli"
fi
echo ""

# EAS CLI
echo "📱 EAS CLI (for Expo Application Services)"
echo "-----------------------------------------"
if command -v eas &> /dev/null; then
    echo -e "${GREEN}✓ EAS CLI is installed${NC}"
else
    echo -e "${YELLOW}❌ EAS CLI not found. Install with:${NC}"
    echo "   npm install -g eas-cli"
fi
echo ""

# Supabase CLI
echo "🗄️  Supabase CLI (for database migrations)"
echo "-----------------------------------------"
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI $(supabase --version) is installed${NC}"
else
    echo -e "${YELLOW}❌ Supabase CLI not found. Install with:${NC}"
    if [[ "$OS" == "macos" ]]; then
        echo "   brew install supabase/tap/supabase"
    elif [[ "$OS" == "linux" ]]; then
        echo "   brew install supabase/tap/supabase"
        echo "   or"
        echo "   npm install -g supabase"
    else
        echo "   npm install -g supabase"
    fi
fi
echo ""

# Vercel CLI
echo "☁️  Vercel CLI (for deployments)"
echo "-------------------------------"
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✓ Vercel CLI is installed${NC}"
else
    echo -e "${YELLOW}❌ Vercel CLI not found. Install with:${NC}"
    echo "   npm install -g vercel"
fi
echo ""

# Git
echo "🔀 Git (version control)"
echo "-----------------------"
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git $(git --version) is installed${NC}"
else
    echo -e "${YELLOW}❌ Git not found. Install from:${NC}"
    echo "   https://git-scm.com/downloads"
fi
echo ""

echo "=================================="
echo -e "${GREEN}✅ Installation guide complete!${NC}"
echo ""
echo "After installing the required tools, run:"
echo "  ./setup.sh"
echo ""
