#!/bin/bash

echo "🏆 راه‌اندازی Tetra Ecosystem Ultimate"
echo "=========================================="

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. در حال نصب..."
    pkg install nodejs -y
fi

# بررسی دایرکتوری
if [ ! -d "src" ]; then
    echo "❌ دایرکتوری src یافت نشد"
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 در حال نصب وابستگی‌ها..."
npm install

# ایجاد دایرکتوری‌های ضروری
mkdir -p logs db backups security/logs public/css public/js public/assets

# ایجاد فایل‌های دیتابیس اولیه
echo '{}' > db/users.json
echo '{}' > db/wallets.json
echo '{}' > db/transactions.json

# ایجاد فایل‌های لاگ
touch logs/system.log
touch logs/security.log

# تنظیم مجوزها
chmod +x src/server/main.js

echo "✅ راه‌اندازی کامل شد!"
echo ""
echo "🚀 دستورات مدیریت:"
echo "   npm start          # راه‌اندازی سرور"
echo "   ./launch-tetra.sh  # راه‌اندازی مجدد"
echo ""
echo "🌐 آدرس‌های دسترسی:"
echo "   صفحه اصلی: http://localhost:3000"
echo "   پنل ادمین: http://localhost:3000/admin"
echo "   فروشگاه: http://localhost:3000/modules"
echo ""
echo "👑 اطلاعات ادمین:"
echo "   کاربری: TetraMaster"
echo "   رمز: MasterTetra2024!"
echo ""
echo "🎯 در حال راه‌اندازی سرور..."

# راه‌اندازی سرور
npm start
