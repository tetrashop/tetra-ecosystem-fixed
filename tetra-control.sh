#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/logs/system.log"
SECURITY_LOG="$SCRIPT_DIR/security/logs/security.log"
PORT=3000

show_banner() {
    echo "🏆 Tetra Ecosystem Ultimate Control System"
    echo "🔐 Version 4.0.0 - Secure Edition"
    echo "🔗 Port: $PORT"
    echo "👑 Admin: TetraMaster"
    echo "========================================"
}

ensure_dependencies() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Installing..."
        pkg install nodejs -y
    fi
    
    if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
        echo "📦 Installing dependencies..."
        cd "$SCRIPT_DIR"
        npm install
    fi
}

check_security() {
    echo "🛡️ Running security checks..."
    
    # بررسی پورت
    if netstat -tulpn 2>/dev/null | grep :$PORT > /dev/null; then
        echo "⚠️ Port $PORT is in use. Checking processes..."
        pkill -f "node.*src/server.js"
        sleep 2
    fi
    
    # بررسی فایل‌های امنیتی
    if [ ! -f "$SECURITY_LOG" ]; then
        mkdir -p "$(dirname "$SECURITY_LOG")"
        touch "$SECURITY_LOG"
        echo "✅ Security log file created"
    fi
}

backup_system() {
    BACKUP_DIR="$SCRIPT_DIR/backups"
    BACKUP_FILE="tetra-ultimate-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    mkdir -p "$BACKUP_DIR"
    echo "💾 Creating secure backup..."
    
    tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
        src/ config/ db/ security/ \
        package.json tetra-control.sh 2>/dev/null
    
    # امن کردن فایل پشتیبان
    chmod 600 "$BACKUP_DIR/$BACKUP_FILE"
    
    echo "✅ Backup created: $BACKUP_FILE"
    echo "🔒 Backup secured with restricted permissions"
}

deploy_vercel() {
    echo "🚀 Preparing for Vercel deployment..."
    
    # ایجاد فایل vercel.json
    cat > vercel.json << 'VEOF'
{
    "version": 2,
    "builds": [
        {
            "src": "src/server.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "src/server.js"
        }
    ],
    "env": {
        "NODE_ENV": "production"
    }
}
VEOF

    echo "✅ Vercel configuration created"
    echo "📝 Next steps:"
    echo "   1. Push to GitHub"
    echo "   2. Connect repository to Vercel"
    echo "   3. Set environment variables"
    echo "   4. Deploy!"
}

case "$1" in
    "start")
        show_banner
        check_security
        ensure_dependencies
        echo "🚀 Starting Tetra Ecosystem Ultimate..."
        cd "$SCRIPT_DIR"
        node src/server.js
        ;;
    "stop")
        show_banner
        echo "🛑 Stopping Tetra Ecosystem..."
        pkill -f "node.*src/server.js"
        sleep 2
        echo "✅ System stopped"
        ;;
    "restart")
        show_banner
        echo "🔄 Restarting Tetra Ecosystem..."
        pkill -f "node.*src/server.js"
        sleep 3
        check_security
        cd "$SCRIPT_DIR"
        node src/server.js
        ;;
    "status")
        show_banner
        if pgrep -f "node.*src/server.js" > /dev/null; then
            echo "🟢 Status: RUNNING"
            echo "📊 Port: $PORT"
            echo "🔗 Local: http://localhost:$PORT"
            echo "💰 Wallet: http://localhost:$PORT/wallet"
            echo "👑 Admin: http://localhost:$PORT/admin"
            IP=$(ip addr show | grep inet | grep -v 127.0.0.1 | head -1 | awk '{print $2}' | cut -d'/' -f1)
            echo "🌐 Network: http://$IP:$PORT"
        else
            echo "🔴 Status: STOPPED"
        fi
        ;;
    "logs")
        show_banner
        if [ -f "$LOG_FILE" ]; then
            echo "📋 Showing system logs:"
            tail -f "$LOG_FILE"
        else
            echo "📋 No log file found. Starting fresh..."
            mkdir -p "$(dirname "$LOG_FILE")"
            touch "$LOG_FILE"
            tail -f "$LOG_FILE"
        fi
        ;;
    "security-logs")
        show_banner
        if [ -f "$SECURITY_LOG" ]; then
            echo "🛡️ Showing security logs:"
            tail -f "$SECURITY_LOG"
        else
            echo "🛡️ No security log file found."
        fi
        ;;
    "backup")
        show_banner
        backup_system
        ;;
    "deploy")
        show_banner
        deploy_vercel
        ;;
    "admin-info")
        show_banner
        echo "👑 Super Admin Access Information:"
        echo "   Username: TetraMaster"
        echo "   Password: MasterTetra2024!"
        echo "   Email: admin@tetra.eco"
        echo ""
        echo "🔐 Security Note: Change password after first login!"
        ;;
    "update")
        show_banner
        echo "🔄 Updating system..."
        cd "$SCRIPT_DIR"
        git pull origin main 2>/dev/null || echo "ℹ️ Not a git repository"
        npm install
        echo "✅ Update completed"
        ;;
    *)
        show_banner
        echo "Usage: $0 {start|stop|restart|status|logs|security-logs|backup|deploy|admin-info|update}"
        echo ""
        echo "Commands:"
        echo "  start          - Start the Tetra Ecosystem"
        echo "  stop           - Stop the system"
        echo "  restart        - Restart the system"
        echo "  status         - Show system status"
        echo "  logs           - Show real-time logs"
        echo "  security-logs  - Show security logs"
        echo "  backup         - Create secure backup"
        echo "  deploy         - Prepare for Vercel deployment"
        echo "  admin-info     - Show admin credentials"
        echo "  update         - Update system files"
        ;;
esac
