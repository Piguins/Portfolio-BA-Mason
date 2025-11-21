#!/bin/bash

# Script để deploy portfolio lên PA Vietnam hosting
# Usage: ./scripts/deploy.sh

echo "🚀 Starting deployment process..."

# Build project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Copy .htaccess to dist if exists
if [ -f "public/.htaccess" ]; then
    echo "📋 Copying .htaccess to dist..."
    cp public/.htaccess dist/.htaccess
    echo "✅ .htaccess copied"
fi

# List files to deploy
echo ""
echo "📁 Files ready to deploy in dist/:"
ls -lh dist/
echo ""
echo "📦 Assets folder:"
ls -lh dist/assets/

echo ""
echo "✅ Build completed!"
echo ""
echo "📤 Next steps:"
echo "1. Login to PA Vietnam Control Panel"
echo "2. Create subdomain 'portfolio' for mason.id.vn"
echo "3. Upload all files from 'dist/' folder to 'public_html/portfolio/'"
echo "4. Wait 5-10 minutes for DNS propagation"
echo "5. Visit: https://portfolio.mason.id.vn"
echo ""
echo "📖 See DEPLOY_GUIDE.md for detailed instructions"

