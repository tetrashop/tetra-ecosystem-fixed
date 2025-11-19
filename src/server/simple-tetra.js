const express = require('express');
const app = express();
const PORT = 8080; // پورت جدید

app.use(express.json());

// کاربران ساده
const users = {
    'TetraMaster': { 
        password: 'MasterTetra2024!', 
        role: 'super_admin',
        email: 'admin@tetra.eco'
    },
    'testuser': { 
        password: 'test123', 
        role: 'user',
        email: 'test@tetra.eco'
    }
};

// API Routes
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 درخواست ورود:', req.body.username);
    
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
    
    res.json({ 
        success: true, 
        token, 
        user: {
            username,
            email: user.email,
            role: user.role
        }
    });
});

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>Tetra Ecosystem</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
                padding: 0;
            }
            .navbar {
                background: rgba(255,255,255,0.1);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .container {
                padding: 3rem 2rem;
                text-align: center;
            }
            .btn {
                display: inline-block;
                padding: 15px 30px;
                margin: 10px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                border: none;
                cursor: pointer;
            }
            .btn-outline {
                background: transparent;
                border: 2px solid #00ff88;
                color: #00ff88;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 40px 0;
                max-width: 1000px;
                margin-left: auto;
                margin-right: auto;
            }
            .feature {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🏆 Tetra Ecosystem</h2>
            <div>
                <a href="/login" class="btn">🚀 ورود</a>
            </div>
        </div>
        
        <div class="container">
            <h1 style="font-size: 3em; color: #00ff88; margin-bottom: 20px;">Tetra Ecosystem</h1>
            <p style="font-size: 1.2em; margin-bottom: 30px;">پلتفرم پیشرفته هوش مصنوعی کوانتومی - نسخه ۵.۰</p>
            
            <div>
                <a href="/login" class="btn">🚀 شروع کنید</a>
                <a href="/modules" class="btn btn-outline">🏗️ ماژول‌ها</a>
            </div>

            <div class="features">
                <div class="feature">
                    <h3>🤖 هوش مصنوعی کوانتومی</h3>
                    <p>۱۲ ماژول پیشرفته AI با معماری کوانتومی</p>
                </div>
                <div class="feature">
                    <h3>🔒 امنیت پیشرفته</h3>
                    <p>سیستم امنیتی مبتنی بر رمزنگاری کوانتومی</p>
                </div>
                <div class="feature">
                    <h3>💰 کیف پول دیجیتال</h3>
                    <p>مدیریت دارایی‌های دیجیتال با قابلیت‌های پیشرفته</p>
                </div>
            </div>

            <div style="margin-top: 50px;">
                <h3>📊 وضعیت سیستم: <span style="color: #00ff88;">فعال ✅</span></h3>
                <p>کاربر پیشفرض: TetraMaster / MasterTetra2024!</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

// صفحه لاگین
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ورود به Tetra</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            .login-container {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.2);
                width: 90%;
                max-width: 400px;
                text-align: center;
            }
            .logo {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .title {
                color: #00ff88;
                margin-bottom: 0.5rem;
            }
            input {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                color: white;
                font-size: 1rem;
            }
            input:focus {
                outline: none;
                border-color: #00ff88;
            }
            button {
                width: 100%;
                padding: 12px;
                background: #00ff88;
                color: black;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 1rem;
            }
            .demo-info {
                margin-top: 1.5rem;
                padding: 1rem;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                font-size: 0.9rem;
            }
            .result {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 5px;
                display: none;
            }
            .success {
                background: rgba(0,255,136,0.2);
                color: #00ff88;
            }
            .error {
                background: rgba(255,0,0,0.2);
                color: #ff4444;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">🏆</div>
            <h1 class="title">ورود به سیستم</h1>
            <p>لطفا اطلاعات خود را وارد کنید</p>
            
            <form id="loginForm">
                <input type="text" id="username" placeholder="نام کاربری" value="TetraMaster" required>
                <input type="password" id="password" placeholder="رمز عبور" value="MasterTetra2024!" required>
                <button type="submit">🚀 ورود</button>
            </form>
            
            <div id="result" class="result"></div>
            
            <div class="demo-info">
                <strong>💡 اطلاعات تست:</strong><br>
                کاربری: TetraMaster<br>
                رمز: MasterTetra2024!<br>
                یا<br>
                کاربری: testuser<br>
                رمز: test123
            </div>
            
            <div style="margin-top: 1rem;">
                <a href="/" style="color: #00ff88;">بازگشت به صفحه اصلی</a>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const resultDiv = document.getElementById('result');
                
                resultDiv.style.display = 'block';
                resultDiv.className = 'result';
                resultDiv.innerHTML = '🔄 در حال ارسال درخواست...';
                
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
                        resultDiv.className = 'result success';
                        resultDiv.innerHTML = '✅ ورود موفق! در حال انتقال به داشبورد...';
                        localStorage.setItem('tetra_token', data.token);
                        
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1500);
                    } else {
                        resultDiv.className = 'result error';
                        resultDiv.innerHTML = '❌ خطا: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = '❌ خطای شبکه: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
    `);
});

// داشبورد
app.get('/dashboard', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>داشبورد</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
            }
            .navbar {
                background: rgba(255,255,255,0.1);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .container {
                padding: 2rem;
            }
            .cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .card {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin: 5px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🏆 Tetra Ecosystem</h2>
            <div>
                <a href="/modules" class="btn">🏗️ ماژول‌ها</a>
                <a href="/" class="btn" style="background: transparent; border: 1px solid #00ff88; color: #00ff88;">🚪 خروج</a>
            </div>
        </div>
        
        <div class="container">
            <h1>داشبورد کاربری</h1>
            <p>✅ شما با موفقیت وارد سیستم شده‌اید!</p>
            
            <div class="cards">
                <div class="card">
                    <h3>💰 موجودی</h3>
                    <p style="font-size: 2em; color: #00ff88;">10,000 TETRA</p>
                </div>
                <div class="card">
                    <h3>🏗️ ماژول‌های فعال</h3>
                    <p style="font-size: 2em; color: #00ff88;">۳ ماژول</p>
                </div>
                <div class="card">
                    <h3>📊 وضعیت</h3>
                    <p style="font-size: 1.5em; color: #00ff88;">فعال ✅</p>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <h3>دسترسی سریع:</h3>
                <a href="/modules" class="btn">🛒 فروشگاه ماژول‌ها</a>
                <a href="/wallet" class="btn">💰 کیف پول</a>
                <a href="/admin" class="btn">👑 پنل مدیریت</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// ماژول‌ها
app.get('/modules', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ماژول‌ها</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
            }
            .navbar {
                background: rgba(255,255,255,0.1);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .container {
                padding: 2rem;
            }
            .module {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                margin: 1rem 0;
                border-radius: 10px;
                border: 1px solid #00ff88;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                border: none;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🏗️ ماژول‌های Tetra</h2>
            <div>
                <a href="/dashboard" class="btn">📊 داشبورد</a>
                <a href="/" class="btn" style="background: transparent; border: 1px solid #00ff88; color: #00ff88;">🚪 خروج</a>
            </div>
        </div>
        
        <div class="container">
            <h1>ماژول‌های پیشرفته</h1>
            
            <div class="module">
                <h3>🤖 هسته کوانتومی AI</h3>
                <p>پردازش هوش مصنوعی کوانتومی پیشرفته برای تحلیل‌های پیچیده</p>
                <p><strong>قیمت: 5,000 TETRA</strong></p>
                <button class="btn">🛒 خرید ماژول</button>
            </div>
            
            <div class="module">
                <h3>📝 تولید محتوای کوانتومی</h3>
                <p>تولید محتوای پیشرفته با AI کوانتومی برای کسب‌وکارها</p>
                <p><strong>قیمت: 3,000 TETRA</strong></p>
                <button class="btn">🛒 خرید ماژول</button>
            </div>
            
            <div class="module">
                <h3>🧠 پردازش زبان طبیعی</h3>
                <p>تحلیل و پردازش زبان‌های طبیعی با دقت بالا</p>
                <p><strong>قیمت: 4,000 TETRA</strong></p>
                <button class="btn">🛒 خرید ماژول</button>
            </div>
        </div>
    </body>
    </html>
    `);
});

// سایر صفحات
app.get('/wallet', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head><meta charset="UTF-8"><title>کیف پول</title></head>
    <body style="background: #0f0c29; color: white; font-family: Tahoma; margin: 0;">
        <div style="background: rgba(255,255,255,0.1); padding: 1rem 2rem;">
            <h2>💰 کیف پول Tetra</h2>
            <a href="/dashboard" style="color: #00ff88;">📊 داشبورد</a>
        </div>
        <div style="padding: 2rem;">
            <h1>مدیریت کیف پول</h1>
            <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 10px;">
                <h3 style="color: #00ff88;">موجودی: 10,000 TETRA</h3>
                <p>وضعیت: فعال ✅</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.get('/admin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head><meta charset="UTF-8"><title>پنل مدیریت</title></head>
    <body style="background: #0f0c29; color: white; font-family: Tahoma; margin: 0;">
        <div style="background: rgba(255,255,255,0.1); padding: 1rem 2rem;">
            <h2>👑 پنل مدیریت</h2>
            <a href="/dashboard" style="color: #00ff88;">📊 داشبورد</a>
        </div>
        <div style="padding: 2rem;">
            <h1>مدیریت سیستم</h1>
            <p>دسترسی سطح مدیر ارشد</p>
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                <h3>📊 آمار سیستم</h3>
                <p>کاربران: ۱۵ نفر</p>
                <p>ماژول‌ها: ۱۲ عدد</p>
                <p>درآمد: ۵۰,۰۰۰ TETRA</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`
    🏆 Tetra Ecosystem - Simple Version
    ===================================
    🌐 آدرس سیستم: http://localhost:${PORT}
    
    👤 کاربران تست:
    - TetraMaster / MasterTetra2024! (مدیر ارشد)
    - testuser / test123 (کاربر عادی)
    
    🚀 سیستم آماده به کار!
    
    📍 صفحات اصلی:
    • صفحه اصلی: http://localhost:${PORT}
    • ورود: http://localhost:${PORT}/login
    • داشبورد: http://localhost:${PORT}/dashboard
    • ماژول‌ها: http://localhost:${PORT}/modules
    `);
});
