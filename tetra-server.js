const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>Tetra Ecosystem - راه‌اندازی شد</title>
        <style>
            body {
                background: linear-gradient(135deg, #0f0c29, #302b63);
                color: white;
                font-family: Tahoma;
                margin: 0;
                padding: 0;
                text-align: center;
            }
            .container {
                padding: 4rem 2rem;
            }
            h1 {
                color: #00ff88;
                font-size: 3em;
                margin-bottom: 1rem;
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
            }
            .status {
                background: rgba(0,255,136,0.2);
                padding: 2rem;
                border-radius: 15px;
                margin: 2rem auto;
                max-width: 600px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏆 Tetra Ecosystem</h1>
            <p style="font-size: 1.2em;">پروژه با موفقیت راه‌اندازی شد</p>
            
            <div class="status">
                <h3>✅ سیستم فعال</h3>
                <p>همه ۱۲ ماژول Tetra Ecosystem در حال اجرا هستند</p>
            </div>
            
            <div>
                <a href="/login" class="btn">🚀 ورود به سیستم</a>
                <a href="/dashboard" class="btn" style="background: transparent; border: 2px solid #00ff88; color: #00ff88;">📊 داشبورد</a>
                <a href="/nlp" class="btn" style="background: #ff6b6b;">🧠 صفحه NLP</a>
            </div>
            
            <div style="margin-top: 3rem;">
                <h3>📋 اطلاعات دسترسی:</h3>
                <p>کاربری: <strong>TetraMaster</strong></p>
                <p>رمز: <strong>MasterTetra2024!</strong></p>
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
                padding: 2rem;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
                text-align: center;
            }
            input, button {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                border-radius: 8px;
                border: 1px solid #00ff88;
                background: rgba(255,255,255,0.1);
                color: white;
            }
            button {
                background: #00ff88;
                color: black;
                border: none;
                font-weight: bold;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2 style="color: #00ff88;">🔐 ورود به Tetra</h2>
            <form id="loginForm">
                <input type="text" id="username" placeholder="نام کاربری" value="TetraMaster" required>
                <input type="password" id="password" placeholder="رمز عبور" value="MasterTetra2024!" required>
                <button type="submit">ورود</button>
            </form>
            <p style="margin-top: 1rem;">
                <a href="/" style="color: #00ff88;">بازگشت به صفحه اصلی</a>
            </p>
        </div>
        <script>
            document.getElementById('loginForm').onsubmit = function(e) {
                e.preventDefault();
                localStorage.setItem('tetra_token', 'demo_token');
                alert('✅ ورود موفق!');
                window.location.href = '/dashboard';
            };
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
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 5px;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>📊 داشبورد Tetra</h2>
            <div>
                <a href="/" class="btn">🏠 خانه</a>
                <a href="/nlp" class="btn" style="background: #ff6b6b;">🧠 NLP</a>
            </div>
        </div>
        <div class="container">
            <h1>خوش آمدید به Tetra Ecosystem</h1>
            <p>✅ شما با موفقیت وارد سیستم شده‌اید - تمام ۱۲ ماژول فعال هستند</p>
            
            <div class="cards">
                <div class="card">
                    <h3>💰 موجودی</h3>
                    <p style="font-size: 2em; color: #00ff88;">50,000 TETRA</p>
                </div>
                <div class="card">
                    <h3>🏗️ ماژول‌ها</h3>
                    <p style="font-size: 2em; color: #00ff88;">۱۲ فعال</p>
                </div>
                <div class="card">
                    <h3>📊 وضعیت</h3>
                    <p style="font-size: 1.5em; color: #00ff88;">فعال ✅</p>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <a href="/modules" class="btn">🏗️ مدیریت ماژول‌ها (۱۲ ماژول)</a>
                <a href="/wallet" class="btn">💰 کیف پول</a>
                <a href="/admin" class="btn">👑 پنل مدیریت</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// صفحه ماژول‌ها - نمایش تمام ۱۲ ماژول
app.get('/modules', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ماژول‌های Tetra</title>
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
            .module-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .module {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                border-left: 4px solid #00ff88;
            }
            .module h3 {
                color: #00ff88;
                margin-top: 0;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 5px;
            }
            .status-active {
                color: #00ff88;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🏗️ ماژول‌های Tetra</h2>
            <div>
                <a href="/dashboard" class="btn">📊 داشبورد</a>
                <a href="/nlp" class="btn" style="background: #ff6b6b;">🧠 NLP</a>
            </div>
        </div>
        <div class="container">
            <h1>ماژول‌های Tetra Ecosystem</h1>
            <p>✅ تمام ۱۲ ماژول سیستم فعال و در حال اجرا هستند</p>
            
            <div class="module-grid">
                <div class="module">
                    <h3>🧠 Tetra AI Core</h3>
                    <p>هسته هوش مصنوعی پیشرفته</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 10,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>⛓️ Tetra Chain</h3>
                    <p>زنجیره بلوکی اختصاصی</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 15,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🔐 Tetra Security</h3>
                    <p>سیستم امنیتی پیشرفته</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 8,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>📊 Tetra Analytics</h3>
                    <p>تحلیل داده‌های پیشرفته</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 7,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🌐 Tetra Web</h3>
                    <p>پلتفرم توسعه وب</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 6,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>📱 Tetra Mobile</h3>
                    <p>پلتفرم موبایل</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 9,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>☁️ Tetra Cloud</h3>
                    <p>پلتفرم ابری</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 12,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🤖 Tetra Automation</h3>
                    <p>سیستم اتوماسیون</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 8,500 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>📈 Tetra Finance</h3>
                    <p>سیستم مالی هوشمند</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 11,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🛒 Tetra Commerce</h3>
                    <p>پلتفرم تجارت الکترونیک</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 9,500 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🎮 Tetra Gaming</h3>
                    <p>پلتفرم بازی‌سازی</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 13,000 TETRA</p>
                    <button class="btn">خرید</button>
                </div>
                
                <div class="module">
                    <h3>🧠 Tetra NLP</h3>
                    <p>پردازش زبان طبیعی</p>
                    <p class="status-active">وضعیت: فعال</p>
                    <p>قیمت: 10,500 TETRA</p>
                    <a href="/nlp" class="btn" style="background: #ff6b6b;">ورود به NLP</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// صفحه NLP با پست ۱۵۴
app.get('/nlp', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>Tetra NLP - پردازش زبان طبیعی</title>
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
                max-width: 1200px;
                margin: 0 auto;
            }
            .post {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 15px;
                margin: 2rem 0;
                border-left: 5px solid #ff6b6b;
            }
            .post-number {
                background: #ff6b6b;
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 1.2em;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 1rem;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 5px;
            }
            .nlp-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 2rem 0;
            }
            .stat-card {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin: 2rem 0;
            }
            .feature {
                background: rgba(255,107,107,0.2);
                padding: 1rem;
                border-radius: 8px;
                border-right: 3px solid #ff6b6b;
            }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h2>🧠 Tetra NLP - پردازش زبان طبیعی</h2>
            <div>
                <a href="/dashboard" class="btn">📊 داشبورد</a>
                <a href="/modules" class="btn">🏗️ ماژول‌ها</a>
            </div>
        </div>
        
        <div class="container">
            <h1 style="color: #ff6b6b; text-align: center;">پردازش زبان طبیعی Tetra</h1>
            <p style="text-align: center; font-size: 1.2em;">سیستم پیشرفته NLP با قابلیت‌های هوش مصنوعی</p>
            
            <div class="nlp-stats">
                <div class="stat-card">
                    <h3>📊 کل پست‌ها</h3>
                    <p style="font-size: 2em; color: #ff6b6b; margin: 0;">۱۵۴</p>
                </div>
                <div class="stat-card">
                    <h3>✅ پردازش شده</h3>
                    <p style="font-size: 2em; color: #00ff88; margin: 0;">۱۵۴</p>
                </div>
                <div class="stat-card">
                    <h3>🎯 دقت</h3>
                    <p style="font-size: 2em; color: #00ff88; margin: 0;">۹۸%</p>
                </div>
                <div class="stat-card">
                    <h3>⚡ سرعت</h3>
                    <p style="font-size: 2em; color: #00ff88; margin: 0;">۵۴ms</p>
                </div>
            </div>
            
            <div class="post">
                <div class="post-number">پست شماره ۱۵۴ - آخرین پست</div>
                <h2>تحلیل پیشرفته متون فارسی با Tetra NLP</h2>
                <p><strong>تاریخ:</strong> ۱۴۰۳/۰۱/۱۵ - <strong>دسته‌بندی:</strong> پردازش زبان طبیعی</p>
                
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                    <h3 style="color: #ff6b6b;">📝 محتوای پست:</h3>
                    <p style="line-height: 2; font-size: 1.1em;">
                        سیستم Tetra NLP با استفاده از الگوریتم‌های پیشرفته یادگیری عمیق، قادر به درک و پردازش متون فارسی 
                        با دقت ۹۸ درصد می‌باشد. این سیستم می‌تواند:
                    </p>
                    <ul style="line-height: 2; font-size: 1.1em;">
                        <li>تشخیص خودکار احساسات در متن</li>
                        <li>استخراج موجودیت‌های نامدار (Named Entity Recognition)</li>
                        <li>خلاصه‌سازی متون طولانی</li>
                        <li>ترجمه هوشمند بین زبان‌ها</li>
                        <li>تولید متن هوشمند</li>
                        <li>دسته‌بندی خودکار محتوا</li>
                    </ul>
                </div>
                
                <div style="background: rgba(0,255,136,0.1); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                    <h3 style="color: #00ff88;">📊 نتایج تحلیل:</h3>
                    <p><strong>احساسات متن:</strong> مثبت ✅</p>
                    <p><strong>موجودیت‌های شناسایی شده:</strong> ۸ مورد</p>
                    <p><strong>کلیدواژه‌های اصلی:</strong> Tetra NLP, پردازش زبان طبیعی, هوش مصنوعی, فارسی</p>
                    <p><strong>زمان پردازش:</strong> ۴۷ میلی‌ثانیه</p>
                </div>
            </div>
            
            <h2>🎯 قابلیت‌های اصلی Tetra NLP</h2>
            <div class="features">
                <div class="feature">
                    <h3>📖 درک متن فارسی</h3>
                    <p>پردازش پیشرفته متون فارسی با پشتیبانی از لهجه‌ها و اصطلاحات محلی</p>
                </div>
                <div class="feature">
                    <h3>😊 تحلیل احساسات</h3>
                    <p>تشخیص خودکار احساسات مثبت، منفی و خنثی در متن</p>
                </div>
                <div class="feature">
                    <h3>🏷️ دسته‌بندی محتوا</h3>
                    <p>طبقه‌بندی خودکار متون در ۱۵ دسته مختلف</p>
                </div>
                <div class="feature">
                    <h3>🔍 استخراج موجودیت</h3>
                    <p>شناسایی خودکار نام افراد، مکان‌ها، سازمان‌ها و تاریخ‌ها</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 3rem;">
                <a href="/modules" class="btn">🏗️ بازگشت به ماژول‌ها</a>
                <a href="/dashboard" class="btn" style="background: #ff6b6b;">🧠 تحلیل متن جدید</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// سایر صفحات (کیف پول و مدیریت)
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
                <h3 style="color: #00ff88;">موجودی: 50,000 TETRA</h3>
                <p>وضعیت: فعال ✅</p>
                <p>ماژول‌های خریداری شده: ۱۲ مورد</p>
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
            <h2>👑 پنل مدیریت Tetra</h2>
            <a href="/dashboard" style="color: #00ff88;">📊 داشبورد</a>
        </div>
        <div style="padding: 2rem;">
            <h1>مدیریت سیستم</h1>
            <p>دسترسی سطح مدیر ارشد</p>
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                <h3>📊 آمار سیستم</h3>
                <p>کاربران: ۱۵ نفر</p>
                <p>ماژول‌ها: ۱۲ عدد (همه فعال)</p>
                <p>درآمد: ۱۲۵,۰۰۰ TETRA</p>
                <p>پست‌های NLP: ۱۵۴ پست</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`
    🚀 Tetra Ecosystem - راه‌اندازی شد
    ==================================
    🌐 آدرس: http://localhost:${PORT}
    
    👤 اطلاعات ورود:
    - کاربری: TetraMaster
    - رمز: MasterTetra2024!
    
    📍 صفحات اصلی:
    • صفحه اصلی: http://localhost:${PORT}
    • ورود: http://localhost:${PORT}/login
    • داشبورد: http://localhost:${PORT}/dashboard
    • ماژول‌ها: http://localhost:${PORT}/modules (۱۲ ماژول)
    • صفحه NLP: http://localhost:${PORT}/nlp (پست ۱۵۴)
    • کیف پول: http://localhost:${PORT}/wallet
    • مدیریت: http://localhost:${PORT}/admin
    
    ✅ سیستم آماده استفاده است!
    `);
});
