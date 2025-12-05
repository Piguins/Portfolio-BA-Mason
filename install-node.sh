#!/bin/bash

# Script to install Node.js and npm on macOS
# This will install Homebrew first (if not installed), then Node.js

set -e

echo "🍺 Checking for Homebrew..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    echo "   This will prompt for your password..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew is already installed"
    brew update
fi

echo ""
echo "📦 Installing Node.js and npm..."
brew install node

echo ""
echo "✅ Installation complete!"
echo ""
echo "Verifying installation..."
node --version
npm --version

echo ""
echo "🎉 Node.js and npm are now installed!"
echo ""
echo "You may need to restart your terminal or run:"
echo "  source ~/.zprofile"

