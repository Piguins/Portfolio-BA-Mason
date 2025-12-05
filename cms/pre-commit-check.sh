#!/bin/bash

# Pre-commit build check script
# Run this BEFORE committing to ensure build passes locally
# This prevents pushing broken code that will fail in Vercel auto-deploy

set -e  # Exit on any error

cd "$(dirname "$0")" || exit

echo "🔍 ========================================="
echo "   PRE-COMMIT BUILD CHECK"
echo "========================================="
echo ""
echo "⚠️  Vercel auto-deploys from main branch"
echo "   Checking build locally before commit..."
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not found. Please install Node.js and npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Step 1: Quick TypeScript check
echo "🔧 Step 1: TypeScript type check..."
if npx tsc --noEmit 2>/dev/null; then
    echo "   ✅ TypeScript check passed"
else
    echo "   ❌ TypeScript errors found!"
    echo "   Please fix TypeScript errors before committing."
    exit 1
fi
echo ""

# Step 2: ESLint check
echo "🔍 Step 2: ESLint check..."
if npm run lint > /dev/null 2>&1; then
    echo "   ✅ ESLint check passed"
else
    echo "   ❌ ESLint errors found!"
    echo "   Please fix linting errors before committing."
    exit 1
fi
echo ""

# Step 3: BUILD CHECK (Critical)
echo "🏗️  Step 3: Production build check..."
echo "   This may take a minute..."
echo ""

if npm run build > /dev/null 2>&1; then
    echo ""
    echo "   ✅ BUILD SUCCESSFUL!"
    echo "   ✅ Safe to commit and push"
else
    echo ""
    echo "   ❌ BUILD FAILED!"
    echo ""
    echo "   Cannot commit - build will fail in Vercel!"
    echo "   Please fix build errors first."
    echo ""
    echo "   To see detailed errors, run:"
    echo "   npm run build"
    exit 1
fi
echo ""

echo "🎉 ========================================="
echo "   ALL CHECKS PASSED!"
echo "========================================="
echo ""
echo "✅ TypeScript check: PASSED"
echo "✅ ESLint check: PASSED"
echo "✅ Build check: PASSED"
echo ""
echo "🚀 Safe to commit and push!"
echo ""


