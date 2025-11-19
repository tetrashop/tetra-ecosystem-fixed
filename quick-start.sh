#!/bin/bash

echo "🚀 راه‌اندازی سریع Tetra Ecosystem..."

# ایجاد دایرکتوری‌های لازم
mkdir -p src/server db logs

# ایجاد فایل main.js ساده
cat > src/server/main.js << 'MAIN_EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Route اصلی
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
                text-align: center;
                padding: 50px;
                margin: 0;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            h1 {
                color: #00ff88;
                font-size: 3em;
                margin-bottom: 20px;
            }
            .btn {
                display: inline-block;
                padding: 15px 30px;
                margin: 10px;
                background: #00ff88;
                color: #000;
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
            }
            .feature {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏆 Tetra Ecosystem</h1>
            <p>پلتفرم هوش مصنوعی کوانتومی - نسخه ۵.۰</p>
            
            <div style="margin: 40px 0;">
                <a href="/login" class="btn">🚀 شروع کنید</a>
                <a href="/modules" class="btn btn-outline">🏗️ مشاهده ماژول‌ها</a>
            </div>

            <div class="features">
                <div class="feature">
                    <h3>🤖 هوش مصنوعی</h3>
                    <p>۱۲ ماژول پیشرفته AI</p>
                </div>
                <div class="feature">
                    <h3>🔒 امنیت کوانتومی</h3>
                    <p>سیستم امنیتی پیشرفته</p>
                </div>
                <div class="feature">
                    <h3>💰 کیف پول</h3>
                    <p>مدیریت دارایی دیجیتال</p>
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

// Route لاگین
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ورود</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
            }
            .login-box {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
            }
            input {
                width: 100%;
                padding: 15px;
                margin: 10px 0;
                background: rgba(255,255,255,0.1);
                border: 1px solid #00ff88;
                border-radius: 8px;
                color: white;
            }
            button {
                width: 100%;
                padding: 15px;
                background: #00ff88;
                color: black;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2 style="text-align: center; color: #00ff88;">🚀 ورود به سیستم</h2>
            <form id="loginForm">
                <input type="text" id="username" placeholder="نام کاربری" value="TetraMaster">
                <input type="password" id="password" placeholder="رمز عبور" value="MasterTetra2024!">
                <button type="submit">ورود</button>
            </form>
            <p style="text-align: center; margin-top: 20px;">
                <a href="/" style="color: #00ff88;">بازگشت به صفحه اصلی</a>
            </p>
        </div>
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                localStorage.setItem('tetra_token', 'demo_token');
                window.location.href = '/dashboard';
            });
        </script>
    </body>
    </html>
    `);
});

// Route داشبورد
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
                padding: 20px;
                display: flex;
                justify-content: space-between;
            }
            .container {
                padding: 40px;
            }
            .cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .card {
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
                <a href="/modules" style="color: #00ff88; margin-left: 20px;">ماژول‌ها</a>
                <a href="/" style="color: #00ff88;">خروج</a>
            </div>
        </div>
        <div class="container">
            <h1>داشبورد کاربری</h1>
            <div class="cards">
                <div class="card">
                    <h3>💰 موجودی</h3>
                    <p>10,000 TETRA</p>
                </div>
                <div class="card">
                    <h3>🏗️ ماژول‌ها</h3>
                    <p>۱۲ ماژول فعال</p>
                </div>
                <div class="card">
                    <h3>📊 وضعیت</h3>
                    <p>فعال ✅</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Route ماژول‌ها
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
                padding: 20px;
                display: flex;
                justify-content: space-between;
            }
            .container {
                padding: 40px;
            }
            .modules {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            .module {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #00ff88;
            }
            .btn {
                background: #00ff88;
                color: black;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🏗️ ماژول‌های Tetra</h2>
            <div>
                <a href="/dashboard" style="color: #00ff88; margin-left: 20px;">داشبورد</a>
                <a href="/" style="color: #00ff88;">خروج</a>
            </div>
        </div>
        <div class="container">
            <h1>ماژول‌های پیشرفته</h1>
            <div class="modules">
                <div class="module">
                    <h3>🤖 هسته کوانتومی AI</h3>
                    <p>پردازش هوش مصنوعی کوانتومی</p>
                    <p>قیمت: 5,000 TETRA</p>
                    <button class="btn">خرید ماژول</button>
                </div>
                <div class="module">
                    <h3>📝 تولید محتوای کوانتومی</h3>
                    <p>تولید محتوای پیشرفته با AI</p>
                    <p>قیمت: 3,000 TETRA</p>
                    <button class="btn">خرید ماژول</button>
                </div>
                <div class="module">
                    <h3>🧠 پردازش زبان طبیعی</h3>
                    <p>تحلیل و پردازش زبان‌های طبیعی</p>
                    <p>قیمت: 4,000 TETRA</p>
                    <button class="btn">خرید ماژول</button>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Route کیف پول
app.get('/wallet', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>کیف پول</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
            }
            .navbar {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                display: flex;
                justify-content: space-between;
            }
            .container {
                padding: 40px;
            }
            .wallet-info {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 10px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>💰 کیف پول Tetra</h2>
            <div>
                <a href="/dashboard" style="color: #00ff88; margin-left: 20px;">داشبورد</a>
                <a href="/" style="color: #00ff88;">خروج</a>
            </div>
        </div>
        <div class="container">
            <h1>مدیریت کیف پول</h1>
            <div class="wallet-info">
                <h3>موجودی: 10,000 TETRA</h3>
                <p>ارز: TETRA Coin</p>
                <p>وضعیت: فعال ✅</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Route ادمین
app.get('/admin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>پنل مدیریت</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
            }
            .navbar {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                display: flex;
                justify-content: space-between;
            }
            .container {
                padding: 40px;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .stat {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>👑 پنل مدیریت</h2>
            <div>
                <a href="/dashboard" style="color: #00ff88; margin-left: 20px;">داشبورد</a>
                <a href="/" style="color: #00ff88;">خروج</a>
            </div>
        </div>
        <div class="container">
            <h1>مدیریت سیستم Tetra</h1>
            <div class="stats">
                <div class="stat">
                    <h3>👥 کاربران</h3>
                    <p>۱۵ کاربر</p>
                </div>
                <div class="stat">
                    <h3>🏗️ ماژول‌ها</h3>
                    <p>۱۲ ماژول</p>
                </div>
                <div class="stat">
                    <h3>💰 درآمد</h3>
                    <p>۵۰,۰۰۰ TETRA</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// API routes
app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, token: 'demo_token', user: { username: 'TetraMaster', role: 'admin' } });
});

app.get('/api/modules', (req, res) => {
    res.json({
        success: true,
        modules: [
            { id: 1, name: 'هسته کوانتومی AI', price: 5000 },
            { id: 2, name: 'تولید محتوای کوانتومی', price: 3000 },
            { id: 3, name: 'پردازش زبان طبیعی', price: 4000 }
        ]
    });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`
    🏆 Tetra Ecosystem Running!
    ===========================
    🌐 http://localhost:${PORT}
    👤 Demo User: TetraMaster
    🔐 Demo Pass: MasterTetra2024!
    🚀 System ready!
    `);
});
MAIN_EOF

echo "✅ سیستم آماده است!"
echo "🚀 در حال راه‌اندازی سرور..."

cd src/server
node main.js
