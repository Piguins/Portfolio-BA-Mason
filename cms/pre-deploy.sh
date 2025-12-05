#!/bin/bash

# Pre-deployment checklist script
# This script will run all checks before deploying

set -e  # Exit on any error

cd "$(dirname "$0")" || exit

echo "🔍 Step 1: Checking for TypeScript/Linter errors..."
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not found. Please install Node.js and npm first."
    exit 1
fi

echo "✅ npm found"
echo ""

echo "📝 Step 2: Formatting code with Prettier..."
npm run format:check
if [ $? -ne 0 ]; then
    echo "⚠️  Code formatting issues found. Running Prettier to fix..."
    npm run format
fi
echo "✅ Code formatting complete"
echo ""

echo "🔍 Step 3: Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint found errors. Please fix them before deploying."
    exit 1
fi
echo "✅ ESLint checks passed"
echo ""

echo "🏗️  Step 4: BUILD CHECK (Critical - Must Pass)..."
echo "   Checking if production build works..."
echo ""
if npm run build; then
    echo ""
    echo "✅ BUILD SUCCESSFUL - Ready for deployment!"
else
    echo ""
    echo "❌ BUILD FAILED - Cannot deploy!"
    echo "   Please fix build errors before deploying."
    exit 1
fi
echo ""

echo "🎉 All checks passed! Ready to deploy."
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Add files: git add ."
echo "  3. Commit: git commit -m 'your message'"
echo "  4. Push: git push"

