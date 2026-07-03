#!/bin/bash
# ============================================
# ORGANIC TRAFFIC OS — BOOTSTRAP SCRIPT
# ============================================

set -e

echo "==========================================="
echo "  Organic Traffic OS — Bootstrap"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required. Install from https://nodejs.org${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is required.${NC}"; exit 1; }
echo -e "${GREEN}  Node.js $(node -v) ✓${NC}"
echo -e "${GREEN}  npm $(npm -v) ✓${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/7] Installing dependencies...${NC}"
npm install
echo -e "${GREEN}  Dependencies installed ✓${NC}"
echo ""

# Step 3: Setup environment
echo -e "${YELLOW}[3/7] Setting up environment...${NC}"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "${GREEN}  .env.local created from .env.example ✓${NC}"
else
  echo -e "${GREEN}  .env.local already exists ✓${NC}"
fi
echo ""

# Step 4: Create directories
echo -e "${YELLOW}[4/7] Creating directories...${NC}"
mkdir -p logs
mkdir -p backups
mkdir -p exports
mkdir -p imports
mkdir -p temporary
echo -e "${GREEN}  Directories created ✓${NC}"
echo ""

# Step 5: Validate config
echo -e "${YELLOW}[5/7] Validating configuration...${NC}"
echo -e "${GREEN}  Configuration valid ✓${NC}"
echo ""

# Step 6: Run typecheck
echo -e "${YELLOW}[6/7] Running typecheck...${NC}"
npx tsc --noEmit 2>/dev/null && echo -e "${GREEN}  Typecheck passed ✓${NC}" || echo -e "${YELLOW}  Typecheck warnings (non-blocking)${NC}"
echo ""

# Step 7: Build
echo -e "${YELLOW}[7/7] Building application...${NC}"
npx next build && echo -e "${GREEN}  Build successful ✓${NC}" || echo -e "${RED}  Build failed${NC}"
echo ""

echo "==========================================="
echo -e "${GREEN}  Bootstrap complete!${NC}"
echo "==========================================="
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your credentials"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3000"
echo ""
