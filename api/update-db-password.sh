#!/bin/bash
# Script to update DATABASE_URL with new password

echo "📝 Nhập password mới từ Supabase Dashboard:"
echo "   (Vào: https://supabase.com/dashboard/project/qeqjowagaybaejjyqjkg/settings/database)"
echo ""
read -sp "Password: " NEW_PASSWORD
echo ""

if [ -z "$NEW_PASSWORD" ]; then
    echo "❌ Password không được để trống"
    exit 1
fi

# URL encode password
ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$NEW_PASSWORD', safe=''))")

# Update .env
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgres://postgres.qeqjowagaybaejjyqjkg:${ENCODED_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true|" .env

echo "✅ Đã update DATABASE_URL trong .env"
echo "🔄 Restart API server để áp dụng thay đổi"
