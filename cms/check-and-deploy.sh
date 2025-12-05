#!/bin/bash

# Check build before deploy script
# This script will check if build is successful before allowing deployment

set -e  # Exit on any error

cd "$(dirname "$0")" || exit

echo "🔍 ========================================="
echo "   CHECK BUILD BEFORE DEPLOY"
echo "========================================="
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not found. Please install Node.js and npm first."
    echo "   Run: ./install-node.sh (from project root)"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo "✅ node found: $(node --version)"
echo ""

# Step 1: Install dependencies (if needed)
echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   ✅ Dependencies already installed"
fi
echo ""

# Step 2: Format code
echo "📝 Step 2: Formatting code with Prettier..."
npm run format
echo "   ✅ Code formatted"
echo ""

# Step 3: Run ESLint
echo "🔍 Step 3: Running ESLint..."
if npm run lint; then
    echo "   ✅ ESLint checks passed"
else
    echo "   ❌ ESLint found errors. Please fix them before deploying."
    exit 1
fi
echo ""

# Step 4: TypeScript check
echo "🔧 Step 4: Checking TypeScript..."
if npx tsc --noEmit; then
    echo "   ✅ TypeScript checks passed"
else
    echo "   ❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi
echo ""

# Step 5: BUILD CHECK (Most important)
echo "🏗️  Step 5: Building project..."
echo "   This is the critical step - checking if production build works..."
echo ""

if npm run build; then
    echo ""
    echo "   ✅ BUILD SUCCESSFUL!"
    echo "   ✅ Production build completed without errors"
else
    echo ""
    echo "   ❌ BUILD FAILED!"
    echo "   ❌ Cannot deploy - build errors must be fixed first"
    exit 1
fi
echo ""

# Step 6: Final verification
echo "🔍 Step 6: Final verification..."
if [ -d ".next" ]; then
    echo "   ✅ Build output directory exists"
    echo "   ✅ Ready for deployment"
else
    echo "   ⚠️  Warning: .next directory not found"
fi
echo ""

echo "🎉 ========================================="
echo "   ALL CHECKS PASSED!"
echo "========================================="
echo ""
echo "✅ Code formatted"
echo "✅ Linting passed"
echo "✅ TypeScript checks passed"
echo "✅ BUILD SUCCESSFUL"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Add files: git add ."
echo "  3. Commit: git commit -m 'your message'"
echo "  4. Push: git push"
echo ""
echo "Or if using CI/CD, push now - deployment should succeed!"
echo ""

