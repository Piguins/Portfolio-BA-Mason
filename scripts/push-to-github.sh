#!/bin/bash

# Script để push code lên GitHub
# Sử dụng: ./scripts/push-to-github.sh "commit message"

COMMIT_MSG=${1:-"Update portfolio website"}

echo "🚀 Đang chuẩn bị push code lên GitHub..."
echo ""

# Kiểm tra xem có thay đổi nào không
if [ -z "$(git status --porcelain)" ]; then
  echo "⚠️  Không có thay đổi nào để commit."
  exit 0
fi

# Add tất cả files
echo "📦 Đang thêm files..."
git add .

# Commit với message
echo "💾 Đang commit với message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Push lên GitHub
echo "⬆️  Đang push lên GitHub..."
git push origin main

echo ""
echo "✅ Hoàn thành! Code đã được push lên GitHub."
echo "🔗 Kiểm tra tại: https://github.com/YOUR_USERNAME/Portfolio-BA-Mason"

