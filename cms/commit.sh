#!/bin/bash

# Smart commit script - Check build before committing
# Usage: ./commit.sh "your commit message"

cd "$(dirname "$0")" || exit

COMMIT_MESSAGE="${1:-Update code}"

echo "🚀 Smart Commit - Checking build before commit..."
echo ""

# Step 1: Run pre-commit checks (including build)
if ./pre-commit-check.sh; then
    echo ""
    echo "📝 All checks passed! Proceeding with commit..."
    echo ""
    
    # Go to root directory
    cd "$(git rev-parse --show-toplevel)" || exit
    
    # Add all changes
    echo "📦 Adding files..."
    git add .
    
    # Commit
    echo "💾 Committing with message: '$COMMIT_MESSAGE'"
    if git commit -m "$COMMIT_MESSAGE"; then
        echo ""
        echo "✅ Commit successful!"
        echo ""
        echo "Next step: git push"
        echo ""
        read -p "Push to remote now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push
        fi
    else
        echo "❌ Commit failed"
        exit 1
    fi
else
    echo ""
    echo "❌ Pre-commit checks failed!"
    echo "   Fix errors before committing."
    exit 1
fi


