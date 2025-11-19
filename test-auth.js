const express = require('express');
const app = express();
const PORT = 3001; // پورت متفاوت

app.use(express.json());

// کاربران ساده
const users = {
    'TetraMaster': { password: 'MasterTetra2024!', role: 'admin' },
    'testuser': { password: 'test123', role: 'user' }
};

// Route لاگین ساده
app.post('/api/auth/login', (req, res) => {
    console.log('📨 دریافت درخواست:', req.body);
    
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
    
    res.json({ 
        success: true, 
        token: 'test_token_' + Date.now(),
        user: {
            username,
            role: user.role
        }
    });
});

// صفحه تست
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>تست احراز هویت</title>
        <style>
            body { font-family: Tahoma; padding: 50px; background: #0f0c29; color: white; }
            .container { max-width: 400px; margin: 0 auto; }
            input, button { width: 100%; padding: 15px; margin: 10px 0; }
            button { background: #00ff88; color: black; border: none; cursor: pointer; }
            .success { color: #00ff88; }
            .error { color: #ff4444; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🧪 تست احراز هویت Tetra</h1>
            <form id="loginForm">
                <input type="text" id="username" placeholder="نام کاربری" value="TetraMaster">
                <input type="password" id="password" placeholder="رمز عبور" value="MasterTetra2024!">
                <button type="submit">ورود</button>
            </form>
            <div id="result"></div>
        </div>
        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                };
                
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<p>🔄 در حال ارسال درخواست...</p>';
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = '<p class="success">✅ ورود موفق! توکن: ' + data.token + '</p>';
                    } else {
                        resultDiv.innerHTML = '<p class="error">❌ خطا: ' + data.error + '</p>';
                    }
                } catch (error) {
                    resultDiv.innerHTML = '<p class="error">❌ خطای شبکه: ' + error.message + '</p>';
                }
            });
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`
    🧪 سرور تست احراز هویت
    🌐 http://localhost:${PORT}
    👤 کاربران تست:
    - TetraMaster / MasterTetra2024!
    - testuser / test123
    `);
});
