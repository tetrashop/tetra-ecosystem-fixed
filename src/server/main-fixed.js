const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002; // پورت متفاوت

app.use(express.json());
app.use(express.static('.'));

// سیستم احراز هویت بسیار ساده
const users = {
    'TetraMaster': { 
        password: 'MasterTetra2024!', 
        role: 'super_admin',
        email: 'admin@tetra.eco',
        wallet: { balance: 1000000, currency: 'TETRA' }
    },
    'testuser': { 
        password: 'test123', 
        role: 'user',
        email: 'test@tetra.eco',
        wallet: { balance: 1000, currency: 'TETRA' }
    }
};

const sessions = new Map();

// API Routes
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 درخواست ورود:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, error: 'نام کاربری و رمز عبور الزامی است' });
    }
    
    const user = users[username];
    
    if (!user) {
        return res.json({ success: false, error: 'کاربر یافت نشد' });
    }
    
    if (user.password !== password) {
        return res.json({ success: false, error: 'رمز عبور نادرست' });
    }
    
    const token = 'tetra_token_' + Date.now();
    sessions.set(token, { username, loginTime: Date.now() });
    
    res.json({ 
        success: true, 
        token, 
        user: {
            username,
            email: user.email,
            role: user.role,
            wallet: user.wallet
        }
    });
});

app.get('/api/auth/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
        return res.status(401).json({ success: false, error: 'توکن نامعتبر' });
    }
    
    const session = sessions.get(token);
    const user = users[session.username];
    
    res.json({ 
        success: true, 
        user: {
            username: session.username,
            email: user.email,
            role: user.role,
            wallet: user.wallet
        }
    });
});

// Routeهای صفحات
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/modules', (req, res) => {
    res.sendFile(path.join(__dirname, 'modules.html'));
});

app.get('/wallet', (req, res) => {
    res.sendFile(path.join(__dirname, 'wallet.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`
    🏆 Tetra Ecosystem Ultimate
    ============================
    🌐 آدرس: http://localhost:${PORT}
    
    👑 کاربران:
    - TetraMaster / MasterTetra2024!
    - testuser / test123
    
    ✅ سیستم آماده به کار!
    `);
});
