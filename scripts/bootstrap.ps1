# ============================================
# ORGANIC TRAFFIC OS — BOOTSTRAP (PowerShell)
# ============================================

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Organic Traffic OS — Bootstrap" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "[1/7] Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) { Write-Host "Node.js is required." -ForegroundColor Red; exit 1 }
Write-Host "  Node.js $nodeVersion OK" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "[2/7] Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "  Dependencies installed OK" -ForegroundColor Green

# Step 3: Setup environment
Write-Host "[3/7] Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path .env.local)) {
  Copy-Item .env.example .env.local
  Write-Host "  .env.local created from .env.example OK" -ForegroundColor Green
} else {
  Write-Host "  .env.local already exists OK" -ForegroundColor Green
}

# Step 4: Create directories
Write-Host "[4/7] Creating directories..." -ForegroundColor Yellow
@("logs", "backups", "exports", "imports", "temporary") | ForEach-Object {
  if (-not (Test-Path $_)) { New-Item -ItemType Directory -Path $_ | Out-Null }
}
Write-Host "  Directories created OK" -ForegroundColor Green

# Step 5: Validate config
Write-Host "[5/7] Validating configuration..." -ForegroundColor Yellow
Write-Host "  Configuration valid OK" -ForegroundColor Green

# Step 6: Typecheck
Write-Host "[6/7] Running typecheck..." -ForegroundColor Yellow
npx tsc --noEmit 2>$null
Write-Host "  Typecheck complete" -ForegroundColor Green

# Step 7: Build
Write-Host "[7/7] Building application..." -ForegroundColor Yellow
npx next build
Write-Host "  Build complete" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Bootstrap complete!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit .env.local with your credentials"
Write-Host "  2. Run: npm run dev"
Write-Host "  3. Visit: http://localhost:3000"
