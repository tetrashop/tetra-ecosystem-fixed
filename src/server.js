import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TetraEcosystemUltimate {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.secretKey = this.generateSecretKey();
        this.users = new Map();
        this.wallets = new Map();
        this.sessions = new Map();
        
        this.initializeSecurity();
        this.setupDirectories();
        this.setupMiddleware();
        this.setupAuth();
        this.setupRoutes();
        this.initializeAdmin();
        
        console.log('🔐 Tetra Ecosystem Ultimate - Initialized');
    }

    generateSecretKey() {
        return require('crypto').randomBytes(64).toString('hex');
    }

    initializeSecurity() {
        // محدودیت نرخ درخواست
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP'
        });

        this.app.use(limiter);
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"]
                }
            }
        }));
        this.app.use(compression());
    }

    setupDirectories() {
        const dirs = ['logs', 'db', 'backups', 'security/logs'];
        dirs.forEach(dir => {
            const dirPath = path.join(__dirname, '..', dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });
    }

    setupMiddleware() {
        this.app.use(cors({
            origin: process.env.NODE_ENV === 'production' ? 
                   ['https://tetra-ecosystem.vercel.app'] : ['http://localhost:3000'],
            credentials: true
        }));
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, '../public')));
        
        // میدلور لاگینگ امن
        this.app.use((req, res, next) => {
            this.securityLog(`${req.method} ${req.path} - ${req.ip} - User: ${req.user?.id || 'Anonymous'}`);
            next();
        });
    }

    setupAuth() {
        // میدلور احراز هویت
        this.app.use((req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                try {
                    const decoded = this.verifyToken(token);
                    req.user = decoded;
                } catch (error) {
                    this.securityLog(`Invalid token: ${error.message}`);
                }
            }
            next();
        });
    }

    setupRoutes() {
        // API احراز هویت
        this.app.post('/api/auth/login', this.handleLogin.bind(this));
        this.app.post('/api/auth/register', this.handleRegister.bind(this));
        this.app.post('/api/auth/logout', this.authenticate.bind(this), this.handleLogout.bind(this));

        // API کیف پول
        this.app.get('/api/wallet', this.authenticate.bind(this), this.getWallet.bind(this));
        this.app.post('/api/wallet/transfer', this.authenticate.bind(this), this.transferFunds.bind(this));

        // API ماژول‌ها
        this.app.get('/api/modules', this.authenticate.bind(this), this.getModules.bind(this));
        this.app.post('/api/modules/:moduleId/access', this.authenticate.bind(this), this.accessModule.bind(this));

        // API مدیریت (فقط برای ادمین اصلی)
        this.app.get('/api/admin/stats', this.authenticateAdmin.bind(this), this.getAdminStats.bind(this));
        this.app.get('/api/admin/users', this.authenticateAdmin.bind(this), this.getAllUsers.bind(this));

        // صفحات اصلی
        this.app.get('/', this.serveDashboard.bind(this));
        this.app.get('/login', this.serveLogin.bind(this));
        this.app.get('/wallet', this.authenticate.bind(this), this.serveWallet.bind(this));
        this.app.get('/admin', this.authenticateAdmin.bind(this), this.serveAdmin.bind(this));
    }

    initializeAdmin() {
        // ایجاد ادمین اصلی
        const adminUser = {
            id: 'admin-master',
            username: 'TetraMaster',
            email: 'admin@tetra.eco',
            password: this.hashPassword('MasterTetra2024!'),
            role: 'super_admin',
            permissions: ['all'],
            createdAt: new Date(),
            lastLogin: null
        };

        this.users.set(adminUser.id, adminUser);
        
        // ایجاد کیف پول ادمین
        const adminWallet = {
            userId: adminUser.id,
            balance: 1000000,
            tetraTokens: 500000,
            transactions: [],
            securityLevel: 'maximum'
        };

        this.wallets.set(adminUser.id, adminWallet);
        
        this.securityLog(`Super Admin initialized: ${adminUser.username}`);
    }

    // 🔐 متدهای احراز هویت
    hashPassword(password) {
        return require('crypto').createHash('sha256').update(password + this.secretKey).digest('hex');
    }

    generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 ساعت
        };
        
        return require('jsonwebtoken').sign(payload, this.secretKey);
    }

    verifyToken(token) {
        return require('jsonwebtoken').verify(token, this.secretKey);
    }

    authenticate(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        try {
            const decoded = this.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            this.securityLog(`Token verification failed: ${error.message}`);
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    authenticateAdmin(req, res, next) {
        this.authenticate(req, res, () => {
            if (req.user.role !== 'super_admin') {
                this.securityLog(`Unauthorized admin access attempt by: ${req.user.id}`);
                return res.status(403).json({ error: 'Admin access required' });
            }
            next();
        });
    }

    // 👥 مدیریت کاربران
    async handleLogin(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }

            // پیدا کردن کاربر
            let user = null;
            for (let [id, u] of this.users) {
                if (u.username === username || u.email === username) {
                    user = u;
                    break;
                }
            }

            if (!user) {
                this.securityLog(`Failed login attempt - User not found: ${username}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // بررسی رمز عبور
            const hashedPassword = this.hashPassword(password);
            if (user.password !== hashedPassword) {
                this.securityLog(`Failed login attempt - Wrong password for: ${username}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // به‌روزرسانی آخرین لاگین
            user.lastLogin = new Date();
            this.users.set(user.id, user);

            // ایجاد توکن
            const token = this.generateToken(user);
            
            // ایجاد سشن
            this.sessions.set(user.id, {
                token,
                lastActivity: Date.now(),
                ip: req.ip
            });

            this.securityLog(`Successful login: ${username} (${user.role})`);

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    permissions: user.permissions
                }
            });

        } catch (error) {
            this.securityLog(`Login error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async handleRegister(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // اعتبارسنجی
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields required' });
            }

            if (password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' });
            }

            // بررسی وجود کاربر
            for (let [id, user] of this.users) {
                if (user.username === username || user.email === email) {
                    return res.status(400).json({ error: 'User already exists' });
                }
            }

            // ایجاد کاربر جدید
            const userId = 'user_' + require('crypto').randomBytes(8).toString('hex');
            const newUser = {
                id: userId,
                username,
                email,
                password: this.hashPassword(password),
                role: 'user',
                permissions: ['basic_access', 'wallet_access'],
                createdAt: new Date(),
                lastLogin: null
            };

            this.users.set(userId, newUser);

            // ایجاد کیف پول کاربر
            const newWallet = {
                userId,
                balance: 1000, // اعتبار اولیه
                tetraTokens: 500,
                transactions: [],
                securityLevel: 'standard'
            };

            this.wallets.set(userId, newWallet);

            this.securityLog(`New user registered: ${username}`);

            res.json({
                success: true,
                message: 'User registered successfully'
            });

        } catch (error) {
            this.securityLog(`Registration error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async handleLogout(req, res) {
        try {
            if (this.sessions.has(req.user.id)) {
                this.sessions.delete(req.user.id);
            }
            
            this.securityLog(`User logged out: ${req.user.username}`);
            res.json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Logout failed' });
        }
    }

    // 💰 متدهای کیف پول
    async getWallet(req, res) {
        try {
            const wallet = this.wallets.get(req.user.id);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            // اطمینان از دسترسی کاربر فقط به کیف پول خودش
            if (wallet.userId !== req.user.id) {
                this.securityLog(`Unauthorized wallet access attempt: ${req.user.id} tried to access ${wallet.userId}`);
                return res.status(403).json({ error: 'Access denied' });
            }

            res.json({
                success: true,
                wallet: {
                    balance: wallet.balance,
                    tetraTokens: wallet.tetraTokens,
                    securityLevel: wallet.securityLevel,
                    recentTransactions: wallet.transactions.slice(-10)
                }
            });

        } catch (error) {
            this.securityLog(`Wallet access error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async transferFunds(req, res) {
        try {
            const { toUserId, amount, token } = req.body;
            
            if (!toUserId || !amount || amount <= 0) {
                return res.status(400).json({ error: 'Invalid transfer parameters' });
            }

            const fromWallet = this.wallets.get(req.user.id);
            const toWallet = this.wallets.get(toUserId);

            if (!fromWallet || !toWallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            // بررسی موجودی
            if (token) {
                if (fromWallet.tetraTokens < amount) {
                    return res.status(400).json({ error: 'Insufficient tokens' });
                }
                fromWallet.tetraTokens -= amount;
                toWallet.tetraTokens += amount;
            } else {
                if (fromWallet.balance < amount) {
                    return res.status(400).json({ error: 'Insufficient balance' });
                }
                fromWallet.balance -= amount;
                toWallet.balance += amount;
            }

            // ثبت تراکنش
            const transaction = {
                id: require('crypto').randomBytes(8).toString('hex'),
                from: req.user.id,
                to: toUserId,
                amount,
                token,
                timestamp: new Date(),
                status: 'completed'
            };

            fromWallet.transactions.push(transaction);
            toWallet.transactions.push(transaction);

            this.securityLog(`Transfer: ${req.user.id} -> ${toUserId} | Amount: ${amount} | Token: ${token}`);

            res.json({
                success: true,
                transaction,
                newBalance: token ? fromWallet.tetraTokens : fromWallet.balance
            });

        } catch (error) {
            this.securityLog(`Transfer error: ${error.message}`);
            res.status(500).json({ error: 'Transfer failed' });
        }
    }

    // 🏗️ متدهای ماژول
    async getModules(req, res) {
        const modules = this.getAvailableModules(req.user);
        res.json({
            success: true,
            modules: modules.map(m => ({
                id: m.id,
                name: m.name,
                description: m.description,
                accessLevel: m.accessLevel,
                status: m.status
            }))
        });
    }

    async accessModule(req, res) {
        try {
            const { moduleId } = req.params;
            const modules = this.getAvailableModules(req.user);
            const module = modules.find(m => m.id === moduleId);

            if (!module) {
                return res.status(404).json({ error: 'Module not found' });
            }

            if (!this.checkModuleAccess(req.user, module)) {
                return res.status(403).json({ error: 'Access denied to this module' });
            }

            this.securityLog(`Module access: ${req.user.id} accessed ${moduleId}`);

            res.json({
                success: true,
                module: {
                    id: module.id,
                    name: module.name,
                    content: module.getContent ? module.getContent(req.user) : module.description,
                    accessTime: new Date()
                }
            });

        } catch (error) {
            this.securityLog(`Module access error: ${error.message}`);
            res.status(500).json({ error: 'Module access failed' });
        }
    }

    getAvailableModules(user) {
        const allModules = [
            {
                id: 'ai-core',
                name: 'هسته هوش مصنوعی تترا',
                description: 'سیستم هوش مصنوعی پیشرفته برای پردازش و تحلیل',
                accessLevel: 'premium',
                status: 'active',
                getContent: (user) => `محتویات اختصاصی هوش مصنوعی برای ${user.username}`
            },
            {
                id: 'quantum-writer',
                name: 'تترا رایتر کوانتومی',
                description: 'سیستم تولید محتوای پیشرفته',
                accessLevel: 'premium',
                status: 'active'
            },
            {
                id: 'nlp-processor',
                name: 'پردازش زبان طبیعی',
                description: 'تحلیل و پردازش متون فارسی و انگلیسی',
                accessLevel: 'standard',
                status: 'active'
            },
            {
                id: 'wallet-manager',
                name: 'مدیریت پیشرفته کیف پول',
                description: 'سیستم مدیریت دارایی و تراکنش‌ها',
                accessLevel: 'standard',
                status: 'active'
            },
            {
                id: 'security-center',
                name: 'مرکز امنیتی',
                description: 'مدیریت امنیت حساب و حریم خصوصی',
                accessLevel: 'standard',
                status: 'active'
            },
            {
                id: 'analytics-dash',
                name: 'داشبورد تحلیل‌گر',
                description: 'تحلیل‌های پیشرفته و آمار',
                accessLevel: 'premium',
                status: 'active'
            },
            {
                id: 'trading-bot',
                name: 'ربات معامله‌گر',
                description: 'سیستم معاملات خودکار',
                accessLevel: 'vip',
                status: 'active'
            },
            {
                id: 'blockchain-explorer',
                name: 'کاوشگر بلاکچین',
                description: 'ردیابی تراکنش‌های بلاکچین',
                accessLevel: 'premium',
                status: 'active'
            },
            {
                id: 'api-manager',
                name: 'مدیریت API',
                description: 'مدیریت رابط‌های برنامه‌نویسی',
                accessLevel: 'developer',
                status: 'active'
            },
            {
                id: 'quantum-analytics',
                name: 'تحلیل‌گر کوانتومی',
                description: 'سیستم تحلیل پیشرفته کوانتومی',
                accessLevel: 'vip',
                status: 'active'
            }
        ];

        return allModules.filter(module => this.checkModuleAccess(user, module));
    }

    checkModuleAccess(user, module) {
        const accessLevels = {
            'user': ['standard'],
            'premium_user': ['standard', 'premium'],
            'vip_user': ['standard', 'premium', 'vip'],
            'developer': ['standard', 'premium', 'developer'],
            'super_admin': ['standard', 'premium', 'vip', 'developer', 'admin']
        };

        const userAccess = accessLevels[user.role] || accessLevels['user'];
        return userAccess.includes(module.accessLevel);
    }

    // 👑 متدهای مدیریت (فقط ادمین اصلی)
    async getAdminStats(req, res) {
        try {
            if (req.user.role !== 'super_admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const stats = {
                totalUsers: this.users.size,
                totalWallets: this.wallets.size,
                activeSessions: this.sessions.size,
                totalBalance: Array.from(this.wallets.values()).reduce((sum, w) => sum + w.balance, 0),
                totalTokens: Array.from(this.wallets.values()).reduce((sum, w) => sum + w.tetraTokens, 0),
                systemUptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                securityEvents: this.getSecurityEvents(50)
            };

            res.json({
                success: true,
                stats,
                timestamp: new Date()
            });

        } catch (error) {
            this.securityLog(`Admin stats error: ${error.message}`);
            res.status(500).json({ error: 'Failed to get admin stats' });
        }
    }

    async getAllUsers(req, res) {
        try {
            if (req.user.role !== 'super_admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const usersData = Array.from(this.users.values()).map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                isOnline: this.sessions.has(user.id)
            }));

            res.json({
                success: true,
                users: usersData,
                total: usersData.length
            });

        } catch (error) {
            this.securityLog(`Admin users access error: ${error.message}`);
            res.status(500).json({ error: 'Failed to get users data' });
        }
    }

    // 🎨 متدهای سرویس صفحات
    serveDashboard(req, res) {
        res.send(this.generateDashboard());
    }

    serveLogin(req, res) {
        res.send(this.generateLoginPage());
    }

    serveWallet(req, res) {
        res.send(this.generateWalletPage(req.user));
    }

    serveAdmin(req, res) {
        if (req.user.role !== 'super_admin') {
            return res.redirect('/login');
        }
        res.send(this.generateAdminPanel(req.user));
    }

    // 🛡️ متدهای امنیتی
    securityLog(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[SECURITY] [${timestamp}] ${message}\n`;
        
        fs.appendFileSync(
            path.join(__dirname, '../security/logs/security.log'), 
            logMessage
        );
        
        console.log(`🛡️ ${message}`);
    }

    getSecurityEvents(limit = 100) {
        try {
            const logPath = path.join(__dirname, '../security/logs/security.log');
            if (!fs.existsSync(logPath)) return [];
            
            const logs = fs.readFileSync(logPath, 'utf8').split('\n').filter(line => line);
            return logs.slice(-limit).reverse();
        } catch (error) {
            return [`Error reading security logs: ${error.message}`];
        }
    }

    // 🎨 جنریتور صفحات HTML
    generateDashboard() {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏆 Tetra Ecosystem - Ultimate</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: white;
            font-family: Tahoma;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { 
            text-align: center; 
            padding: 2rem 0; 
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            margin-bottom: 2rem;
        }
        .nav {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav a {
            color: #00ff88;
            text-decoration: none;
            padding: 0.8rem 1.5rem;
            border: 2px solid #00ff88;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: bold;
        }
        .nav a:hover {
            background: #00ff88;
            color: #0f0c29;
            transform: translateY(-2px);
        }
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .module-card {
            background: rgba(255,255,255,0.08);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s;
            cursor: pointer;
        }
        .module-card:hover {
            transform: translateY(-5px);
            border-color: #00ff88;
            box-shadow: 0 10px 25px rgba(0,255,136,0.3);
        }
        .status-badge {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        }
        .status-active { background: #00ff88; color: #000; }
        .status-premium { background: #ffd700; color: #000; }
        .status-vip { background: #ff00ff; color: #000; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 اکوسیستم تترا - نسخه اولتیمیت</h1>
            <p>سیستم ایمن و پیشرفته با ۱۰ ماژول تخصصی</p>
            <p>🕒 ${new Date().toLocaleString('fa-IR')}</p>
            <div class="nav">
                <a href="/login">🔐 ورود به سیستم</a>
                <a href="/register">📝 ثبت نام</a>
                <a href="/wallet">💰 کیف پول من</a>
                <a href="/admin">👑 پنل مدیریت</a>
            </div>
        </div>

        <h2 style="text-align: center; margin: 2rem 0 1rem 0;">ماژول‌های پیشرفته:</h2>
        <div class="modules-grid">
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🤖 هسته هوش مصنوعی تترا</h3>
                <p>سیستم هوش مصنوعی پیشرفته برای پردازش و تحلیل</p>
                <span class="status-badge status-premium">پرمیوم</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>📝 تترا رایتر کوانتومی</h3>
                <p>سیستم تولید محتوای پیشرفته</p>
                <span class="status-badge status-premium">پرمیوم</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🧠 پردازش زبان طبیعی</h3>
                <p>تحلیل و پردازش متون فارسی و انگلیسی</p>
                <span class="status-badge status-active">استاندارد</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>💼 مدیریت پیشرفته کیف پول</h3>
                <p>سیستم مدیریت دارایی و تراکنش‌ها</p>
                <span class="status-badge status-active">استاندارد</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🛡️ مرکز امنیتی</h3>
                <p>مدیریت امنیت حساب و حریم خصوصی</p>
                <span class="status-badge status-active">استاندارد</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>📊 داشبورد تحلیل‌گر</h3>
                <p>تحلیل‌های پیشرفته و آمار</p>
                <span class="status-badge status-premium">پرمیوم</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🤖 ربات معامله‌گر</h3>
                <p>سیستم معاملات خودکار</p>
                <span class="status-badge status-vip">VIP</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🔗 کاوشگر بلاکچین</h3>
                <p>ردیابی تراکنش‌های بلاکچین</p>
                <span class="status-badge status-premium">پرمیوم</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>⚙️ مدیریت API</h3>
                <p>مدیریت رابط‌های برنامه‌نویسی</p>
                <span class="status-badge status-vip">توسعه‌دهنده</span>
            </div>
            <div class="module-card" onclick="alert('لطفا ابتدا وارد سیستم شوید')">
                <h3>🔮 تحلیل‌گر کوانتومی</h3>
                <p>سیستم تحلیل پیشرفته کوانتومی</p>
                <span class="status-badge status-vip">VIP</span>
            </div>
        </div>
    </div>

    <script>
        console.log('🏆 Tetra Ecosystem Ultimate - Dashboard Loaded');
    </script>
</body>
</html>
        `;
    }

    generateLoginPage() {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 ورود - Tetra Ecosystem</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: white;
            font-family: Tahoma;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .login-container {
            background: rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            width: 100%;
            max-width: 400px;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 1rem;
        }
        button {
            width: 100%;
            padding: 1rem;
            background: #00ff88;
            color: #000;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover {
            background: #00cc66;
            transform: translateY(-2px);
        }
        .links {
            text-align: center;
            margin-top: 1.5rem;
        }
        .links a {
            color: #00ff88;
            text-decoration: none;
            margin: 0 0.5rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2 style="text-align: center; margin-bottom: 2rem;">🔐 ورود به سیستم تترا</h2>
        <form id="loginForm">
            <div class="form-group">
                <label>نام کاربری یا ایمیل:</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label>رمز عبور:</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit">🚀 ورود به سیستم</button>
        </form>
        <div class="links">
            <a href="/">🏠 صفحه اصلی</a>
            <a href="/register">📝 ثبت نام</a>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('tetra_token', data.token);
                    alert('✅ ورود موفقیت‌آمیز!');
                    window.location.href = '/wallet';
                } else {
                    alert('❌ ' + data.error);
                }
            } catch (error) {
                alert('❌ خطا در ارتباط با سرور');
            }
        });
    </script>
</body>
</html>
        `;
    }

    generateWalletPage(user) {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💰 کیف پول - Tetra Ecosystem</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: white;
            font-family: Tahoma;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { 
            text-align: center; 
            padding: 2rem 0; 
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            margin-bottom: 2rem;
        }
        .wallet-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .wallet-card {
            background: rgba(255,255,255,0.08);
            padding: 2rem;
            border-radius: 12px;
            border: 2px solid rgba(255,255,255,0.2);
            text-align: center;
        }
        .balance {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 1rem 0;
            color: #00ff88;
        }
        .nav {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav a {
            color: #00ff88;
            text-decoration: none;
            padding: 0.8rem 1.5rem;
            border: 2px solid #00ff88;
            border-radius: 8px;
            transition: all 0.3s;
        }
        .nav a:hover {
            background: #00ff88;
            color: #0f0c29;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 کیف پول شخصی</h1>
            <p>کاربر: ${user.username} | سطح: ${user.role}</p>
            <div class="nav">
                <a href="/">🏠 صفحه اصلی</a>
                <a href="#" onclick="loadWallet()">🔄 بروزرسانی</a>
                <a href="#" onclick="logout()">🚪 خروج</a>
                ${user.role === 'super_admin' ? '<a href="/admin">👑 پنل مدیریت</a>' : ''}
            </div>
        </div>

        <div class="wallet-grid">
            <div class="wallet-card">
                <h3>💵 موجودی حساب</h3>
                <div class="balance" id="balance">0</div>
                <p>واحد: TETRA</p>
            </div>
            <div class="wallet-card">
                <h3>🪙 توکن‌های تترا</h3>
                <div class="balance" id="tokens">0</div>
                <p>توکن اختصاصی</p>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; margin-top: 2rem;">
            <h3>📋 آخرین تراکنش‌ها</h3>
            <div id="transactions" style="margin-top: 1rem;">
                در حال بارگذاری...
            </div>
        </div>
    </div>

    <script>
        const token = localStorage.getItem('tetra_token');
        
        if (!token) {
            window.location.href = '/login';
        }

        async function loadWallet() {
            try {
                const response = await fetch('/api/wallet', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                const data = await response.json();

                if (data.success) {
                    document.getElementById('balance').textContent = data.wallet.balance.toLocaleString();
                    document.getElementById('tokens').textContent = data.wallet.tetraTokens.toLocaleString();
                    
                    const transactions = data.wallet.recentTransactions || [];
                    const transactionsHTML = transactions.length > 0 ? 
                        transactions.map(t => `
                            <div style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                ${t.amount} TETRA - ${new Date(t.timestamp).toLocaleString('fa-IR')}
                            </div>
                        `).join('') :
                        '<p>تراکنشی یافت نشد</p>';
                    
                    document.getElementById('transactions').innerHTML = transactionsHTML;
                } else {
                    alert('خطا در بارگذاری کیف پول');
                }
            } catch (error) {
                alert('خطا در ارتباط با سرور');
            }
        }

        function logout() {
            localStorage.removeItem('tetra_token');
            window.location.href = '/login';
        }

        // بارگذاری اولیه
        loadWallet();
    </script>
</body>
</html>
        `;
    }

    generateAdminPanel(user) {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>👑 پنل مدیریت - Tetra Ecosystem</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #2d0c29, #632b63, #3e2442);
            color: white;
            font-family: Tahoma;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { 
            text-align: center; 
            padding: 2rem 0; 
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            margin-bottom: 2rem;
            border: 2px solid #ff00ff;
        }
        .admin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .admin-card {
            background: rgba(255,255,255,0.08);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #ff00ff;
            margin: 0.5rem 0;
        }
        .nav {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav a {
            color: #ff00ff;
            text-decoration: none;
            padding: 0.8rem 1.5rem;
            border: 2px solid #ff00ff;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: bold;
        }
        .nav a:hover {
            background: #ff00ff;
            color: #2d0c29;
        }
        .users-table {
            width: 100%;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            overflow: hidden;
            margin-top: 1rem;
        }
        .users-table th, .users-table td {
            padding: 1rem;
            text-align: right;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👑 پنل مدیریت ارشد</h1>
            <p>کاربر: ${user.username} | نقش: مدیریت ارشد</p>
            <p>دسترسی کامل به تمامی بخش‌های سیستم</p>
            <div class="nav">
                <a href="/">🏠 صفحه اصلی</a>
                <a href="/wallet">💰 کیف پول</a>
                <a href="#" onclick="loadStats()">📊 بروزرسانی آمار</a>
                <a href="#" onclick="loadUsers()">👥 مدیریت کاربران</a>
                <a href="#" onclick="logout()">🚪 خروج</a>
            </div>
        </div>

        <div class="admin-grid">
            <div class="admin-card">
                <h3>👥 کاربران کل</h3>
                <div class="stat-number" id="totalUsers">0</div>
                <p>تعداد کاربران ثبت‌نام شده</p>
            </div>
            <div class="admin-card">
                <h3>💼 کیف پول‌ها</h3>
                <div class="stat-number" id="totalWallets">0</div>
                <p>تعداد کیف پول‌های فعال</p>
            </div>
            <div class="admin-card">
                <h3>🔐 سشن‌ها</h3>
                <div class="stat-number" id="activeSessions">0</div>
                <p>کاربران آنلاین</p>
            </div>
            <div class="admin-card">
                <h3>💰 مجموع موجودی</h3>
                <div class="stat-number" id="totalBalance">0</div>
                <p>کل موجودی سیستم</p>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; margin-top: 2rem;">
            <h3>👥 مدیریت کاربران سیستم</h3>
            <div id="usersList" style="margin-top: 1rem;">
                در حال بارگذاری...
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; margin-top: 2rem;">
            <h3>🛡️ لاگ‌های امنیتی</h3>
            <div id="securityLogs" style="margin-top: 1rem; max-height: 300px; overflow-y: auto;">
                در حال بارگذاری...
            </div>
        </div>
    </div>

    <script>
        const token = localStorage.getItem('tetra_token');
        
        if (!token) {
            window.location.href = '/login';
        }

        async function loadStats() {
            try {
                const response = await fetch('/api/admin/stats', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                const data = await response.json();

                if (data.success) {
                    document.getElementById('totalUsers').textContent = data.stats.totalUsers;
                    document.getElementById('totalWallets').textContent = data.stats.totalWallets;
                    document.getElementById('activeSessions').textContent = data.stats.activeSessions;
                    document.getElementById('totalBalance').textContent = data.stats.totalBalance.toLocaleString();
                }
            } catch (error) {
                alert('خطا در بارگذاری آمار');
            }
        }

        async function loadUsers() {
            try {
                const response = await fetch('/api/admin/users', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                const data = await response.json();

                if (data.success) {
                    const usersHTML = data.users.map(user => `
                        <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <strong>${user.username}</strong> - ${user.email}
                            <br>نقش: ${user.role} | عضویت: ${new Date(user.createdAt).toLocaleString('fa-IR')}
                            ${user.isOnline ? ' <span style="color: #00ff88;">● آنلاین</span>' : ' <span style="color: #ff4444;">● آفلاین</span>'}
                        </div>
                    `).join('');
                    
                    document.getElementById('usersList').innerHTML = usersHTML;
                }
            } catch (error) {
                alert('خطا در بارگذاری کاربران');
            }
        }

        function logout() {
            localStorage.removeItem('tetra_token');
            window.location.href = '/login';
        }

        // بارگذاری اولیه
        loadStats();
        loadUsers();
    </script>
</body>
</html>
        `;
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('\n' + '='.repeat(70));
            console.log('🏆 TETRA ECOSYSTEM ULTIMATE - SECURE EDITION');
            console.log('='.repeat(70));
            console.log(`🔐 پورت: ${this.port}`);
            console.log(`🌐 آدرس محلی: http://localhost:${this.port}`);
            console.log(`👑 ادمین اصلی: TetraMaster`);
            console.log(`🔑 رمز ادمین: MasterTetra2024!`);
            console.log(`💾 حافظه: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`);
            console.log('='.repeat(70));
            console.log('✅ سیستم با موفقیت راه‌اندازی شد!');
            console.log('🎯 ۱۰ ماژول پیشرفته فعال');
            console.log('🛡️ امنیت پیشرفته فعال');
            console.log('👥 سیستم کاربری ایمن');
            console.log('💰 کیف پول امن');
            console.log('='.repeat(70) + '\n');

            this.securityLog(`System started successfully on port ${this.port}`);
        });
    }
}

// راه‌اندازی سیستم
const tetraSystem = new TetraEcosystemUltimate();
tetraSystem.start();

// مدیریت graceful shutdown
process.on('SIGINT', () => {
    tetraSystem.securityLog('System shutdown initiated');
    console.log('\n🛑 سیستم در حال خاتمه...');
    process.exit(0);
});
