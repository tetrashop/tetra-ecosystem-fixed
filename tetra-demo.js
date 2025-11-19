const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('.'));

console.log(`
🎪 Tetra Ecosystem Demo Server
==============================

📋 ویژگی‌های دمو:
• 🔄 Real-time Updates
• 📊 Interactive Dashboard  
• 🧠 Live AI Processing
• 💰 Virtual Transactions
• 🎮 Gaming Integration
• 📱 Mobile Preview

🌐 آدرس: http://localhost:${PORT}
`);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>Tetra Ecosystem Demo</title>
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-family: Tahoma;
                margin: 0;
                padding: 0;
            }
            .demo-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }
            .demo-card {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                margin: 1rem 0;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .live-demo {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 2rem 0;
            }
            .demo-item {
                background: rgba(255,255,255,0.15);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            }
            .demo-item:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.25);
            }
        </style>
    </head>
    <body>
        <div class="demo-container">
            <h1 style="text-align: center; color: #00ff88;">🎪 Tetra Ecosystem Demo</h1>
            
            <div class="demo-card">
                <h2>🚀 دموی زنده سیستم</h2>
                <p>انتخاب کنید چه بخشی را تست کنید:</p>
                
                <div class="live-demo">
                    <div class="demo-item" onclick="alert('🧠 در حال پردازش NLP...')">
                        <h3>🧠 پردازش زبان طبیعی</h3>
                        <p>تست تحلیل متن فارسی</p>
                    </div>
                    
                    <div class="demo-item" onclick="alert('💰 تراکنش آزمایشی انجام شد!')">
                        <h3>💰 تراکنش بلاکچین</h3>
                        <p>شبیه‌سازی انتقال TETRA</p>
                    </div>
                    
                    <div class="demo-item" onclick="alert('🤖 مدل AI آموزش داده شد!')">
                        <h3>🤖 آموزش هوش مصنوعی</h3>
                        <p>شبیه‌سازی یادگیری ماشین</p>
                    </div>
                    
                    <div class="demo-item" onclick="alert('📱 اپلیکیشن موبایل ساخته شد!')">
                        <h3>📱 ساخت اپ موبایل</h3>
                        <p>تست React Native</p>
                    </div>
                </div>
            </div>
            
            <div class="demo-card">
                <h2>📊 آمار زنده سیستم</h2>
                <div id="liveStats">
                    <p>👥 کاربران آنلاین: <span id="onlineUsers">15</span></p>
                    <p>⚡ تراکنش‌ها: <span id="transactions">1,247</span></p>
                    <p>🧠 پردازش‌های AI: <span id="aiProcesses">8,542</span></p>
                    <p>📊 ماژول‌های فعال: <span id="activeModules">12</span></p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <a href="http://localhost:3000" style="background: #00ff88; color: black; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold;">
                    🏠 بازگشت به سیستم اصلی
                </a>
            </div>
        </div>
        
        <script>
            // شبیه‌سازی آمار زنده
            setInterval(() => {
                document.getElementById('onlineUsers').textContent = 
                    Math.floor(15 + Math.random() * 10);
                document.getElementById('transactions').textContent = 
                    (1247 + Math.floor(Math.random() * 100)).toLocaleString();
                document.getElementById('aiProcesses').textContent = 
                    (8542 + Math.floor(Math.random() * 500)).toLocaleString();
            }, 2000);
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Demo Server running at http://localhost:${PORT}`);
});
