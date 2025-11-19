#!/bin/bash
echo "🔧 مدیریت اکوسیستم تترا"

case $1 in
    "start")
        echo "🚀 راه‌اندازی سیستم..."
        npm start
        ;;
    "stop")
        echo "🛑 توقف سیستم..."
        pkill -f "node.*server.js"
        ;;
    "restart")
        echo "🔄 راه‌اندازی مجدد..."
        pkill -f "node.*server.js"
        sleep 2
        npm start
        ;;
    "status")
        echo "📊 وضعیت سیستم:"
        pgrep -f "node.*server.js" && echo "🟢 فعال" || echo "🔴 غیرفعال"
        ;;
    "logs")
        echo "📋 نمایش لاگ‌ها:"
        tail -f logs/app.log
        ;;
    *)
        echo "دستورات موجود:"
        echo "  start   - راه‌اندازی سیستم"
        echo "  stop    - توقف سیستم"
        echo "  restart - راه‌اندازی مجدد"
        echo "  status  - بررسی وضعیت"
        echo "  logs    - نمایش لاگ‌ها"
        ;;
esac
