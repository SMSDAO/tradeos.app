#!/bin/bash
set -e

echo "🚀 TradeOS Monorepo Setup Script"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Please run install.sh first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ pnpm found${NC}"

# Check if .env.local exists, if not create from .env.example
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit .env.local with your actual values!${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Initialize Supabase (if CLI is installed)
if command -v supabase &> /dev/null; then
    echo ""
    echo "🗄️  Supabase CLI found. Initializing..."
    
    if [ ! -d "infra/supabase/.git" ]; then
        cd infra/supabase
        supabase init || echo -e "${YELLOW}⚠️  Supabase already initialized or initialization failed${NC}"
        cd ../..
    else
        echo -e "${GREEN}✓ Supabase already initialized${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Skipping Supabase initialization.${NC}"
    echo -e "${YELLOW}   Install it with: npm install -g supabase${NC}"
fi

# Build shared packages
echo ""
echo "🔨 Building shared packages..."
pnpm turbo run build --filter=shared --if-present

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your actual Supabase credentials"
echo "  2. Run 'pnpm dev' or './master.sh' to start development"
echo "  3. Visit http://localhost:3000 for web-admin"
echo ""
echo -e "${YELLOW}⚠️  Security reminder: Never commit .env.local or SUPABASE_SERVICE_ROLE_KEY${NC}"
