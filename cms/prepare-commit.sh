#!/bin/bash

# Prepare commit script - Run this before every commit
# This ensures build passes locally before pushing to main (which auto-deploys)

cd "$(dirname "$0")" || exit

echo "🚀 Preparing for commit..."
echo ""

# Run pre-commit check first
if ./pre-commit-check.sh; then
    echo ""
    echo "✅ All checks passed! Ready to commit."
    echo ""
    echo "Next:"
    echo "  git add ."
    echo "  git commit -m 'your message'"
    echo "  git push"
else
    echo ""
    echo "❌ Pre-commit checks failed!"
    echo "   Fix errors before committing."
    exit 1
fi


