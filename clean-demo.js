const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));

console.log('🎪 Tetra Ecosystem Interactive Demo');
console.log('===================================');
console.log('🚀 در حال راه‌اندازی دموی تعاملی...');
console.log('📊 سیستم شامل ۱۲ ماژول فعال');
console.log('🧠 ۱۵۴ پست NLP پردازش شده');
console.log('💰 ۵۰,۰۰۰ TETRA موجودی');
console.log('🌐 آدرس دمو: http://localhost:' + PORT);
console.log('📱 آدرس اصلی: http://localhost:3000');
console.log('✅ دمو آماده است!');

// داده‌های دمو
let demoData = {
    users: 15,
    transactions: 1247,
    aiProcesses: 8542,
    nlpPosts: 154,
    tetraBalance: 50000,
    activeModules: 12,
    onlineUsers: 8
};

// API برای آمار زنده
app.get('/api/stats', (req, res) => {
    demoData.onlineUsers = 8 + Math.floor(Math.random() * 5);
    demoData.transactions += Math.floor(Math.random() * 10);
    demoData.aiProcesses += Math.floor(Math.random() * 50);
    demoData.tetraBalance += Math.floor(Math.random() * 100) - 50;
    
    res.json(demoData);
});

// API برای اجرای دمو
app.post('/api/demo', (req, res) => {
    const { type } = req.body;
    let message, details;
    
    switch(type) {
        case 'nlp':
            message = '🧠 تحلیل NLP انجام شد';
            details = 'پردازش متن فارسی با دقت ۹۸%';
            demoData.aiProcesses += 5;
            break;
        case 'blockchain':
            message = '⛓️ تراکنش بلاکچین تایید شد';
            details = 'انتقال ۵۰۰ TETRA با موفقیت';
            demoData.transactions += 1;
            demoData.tetraBalance -= 500;
            break;
        case 'ai':
            message = '🤖 مدل AI آموزش داده شد';
            details = 'پیشرفت آموزش: ۹۵% - دقت: ۹۷%';
            demoData.aiProcesses += 10;
            break;
        case 'mobile':
            message = '📱 اپلیکیشن موبایل ساخته شد';
            details = 'React Native - سازگار با iOS و Android';
            break;
        case 'security':
            message = '🔐 تست امنیتی موفق';
            details = 'احراز هویت دو مرحله‌ای فعال شد';
            break;
        case 'gaming':
            message = '🎮 بازی ساخته شد';
            details = 'یکپارچه با NFT و اقتصاد درون بازی';
            break;
        default:
            message = '🚀 عملیات انجام شد';
            details = 'سیستم Tetra فعال';
    }
    
    res.json({ message, details });
});

// صفحه اصلی دمو
app.get('/', (req, res) => {
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>Tetra Ecosystem - دموی تعاملی</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Tahoma', 'Segoe UI', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: white;
            min-height: 100vh;
            direction: rtl;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 2rem 0;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .header h1 {
            color: #00ff88;
            font-size: 3em;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 20px #00ff88;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 2rem 0;
        }
        
        .stat-card {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            border-color: #00ff88;
        }
        
        .stat-card h3 {
            color: #00ff88;
            margin-bottom: 0.5rem;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
        }
        
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
            margin: 3rem 0;
        }
        
        .demo-card {
            background: rgba(255,255,255,0.08);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .demo-card:hover {
            transform: translateY(-8px);
            background: rgba(255,255,255,0.12);
        }
        
        .demo-card h3 {
            color: #00ff88;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .demo-btn {
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            color: black;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 1em;
        }
        
        .demo-btn:hover {
            transform: scale(1.05);
        }
        
        .live-feed {
            background: rgba(255,255,255,0.05);
            padding: 2rem;
            border-radius: 20px;
            margin: 2rem 0;
        }
        
        .activity-item {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 10px;
            border-right: 3px solid #00ff88;
        }
        
        .nav-btn {
            background: rgba(255,255,255,0.1);
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.2);
            margin: 5px;
        }
        
        .nav-btn:hover {
            background: rgba(0,255,136,0.2);
            border-color: #00ff88;
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2em; }
            .demo-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎪 Tetra Ecosystem</h1>
            <p>دموی تعاملی - تجربه تمامی قابلیت‌های سیستم</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>👥 کاربران آنلاین</h3>
                <div class="stat-number" id="onlineUsers">${demoData.onlineUsers}</div>
            </div>
            
            <div class="stat-card">
                <h3>⚡ تراکنش‌ها</h3>
                <div class="stat-number" id="transactions">${demoData.transactions.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <h3>🧠 پردازش AI</h3>
                <div class="stat-number" id="aiProcesses">${demoData.aiProcesses.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <h3>💰 موجودی TETRA</h3>
                <div class="stat-number" id="tetraBalance">${demoData.tetraBalance.toLocaleString()}</div>
            </div>
        </div>
        
        <div class="demo-grid">
            <div class="demo-card" onclick="runDemo('nlp')">
                <h3>🧠 پردازش زبان طبیعی</h3>
                <p>تست سیستم NLP پیشرفته با تحلیل متن فارسی</p>
                <button class="demo-btn" onclick="event.stopPropagation(); runDemo('nlp')">اجرای دمو</button>
            </div>
            
            <div class="demo-card" onclick="runDemo('blockchain')">
                <h3>⛓️ تراکنش بلاکچین</h3>
                <p>شبیه‌سازی انتقال امن TETRA</p>
                <button class="demo-btn" onclick="event.stopPropagation(); runDemo('blockchain')">اجرای دمو</button>
            </div>
            
            <div class="demo-card" onclick="runDemo('ai')">
                <h3>🤖 آموزش هوش مصنوعی</h3>
                <p>شبیه‌سازی آموزش مدل ML</p>
                <button class="demo-btn" onclick="event.stopPropagation(); runDemo('ai')">اجرای دمو</button>
            </div>
        </div>
        
        <div class="live-feed">
            <h2 style="color: #00ff88; text-align: center; margin-bottom: 1.5rem;">📊 فعالیت‌های زنده سیستم</h2>
            <div class="activity-list" id="activityFeed">
                <div class="activity-item">
                    <strong>✅ سیستم Tetra NLP راه‌اندازی شد</strong>
                    <br><small>${new Date().toLocaleTimeString('fa-IR')} - پردازش ۱۵۴ پست</small>
                </div>
                <div class="activity-item">
                    <strong>🔐 کاربر TetraMaster وارد سیستم شد</strong>
                    <br><small>${new Date().toLocaleTimeString('fa-IR')}</small>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 2rem;">
            <p>🚀 Tetra Ecosystem - نسخه دموی تعاملی</p>
            <div style="margin-top: 1rem;">
                <a href="http://localhost:3000" class="nav-btn">🏠 سیستم اصلی Tetra</a>
                <a href="http://localhost:3000/modules" class="nav-btn">🏗️ ماژول‌ها</a>
                <a href="http://localhost:3000/nlp" class="nav-btn">🧠 صفحه NLP</a>
            </div>
        </div>
    </div>
    
    <script>
        function updateLiveStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('onlineUsers').textContent = data.onlineUsers;
                    document.getElementById('transactions').textContent = data.transactions.toLocaleString();
                    document.getElementById('aiProcesses').textContent = data.aiProcesses.toLocaleString();
                    document.getElementById('tetraBalance').textContent = data.tetraBalance.toLocaleString();
                });
        }
        
        function runDemo(type) {
            fetch('/api/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: type })
            })
            .then(response => response.json())
            .then(data => {
                const activityFeed = document.getElementById('activityFeed');
                const newActivity = document.createElement('div');
                newActivity.className = 'activity-item';
                newActivity.innerHTML = '<strong>' + data.message + '</strong><br><small>' + new Date().toLocaleTimeString('fa-IR') + ' - ' + data.details + '</small>';
                activityFeed.insertBefore(newActivity, activityFeed.firstChild);
                
                if (activityFeed.children.length > 10) {
                    activityFeed.removeChild(activityFeed.lastChild);
                }
                
                updateLiveStats();
                alert(data.message);
            });
        }
        
        setInterval(updateLiveStats, 5000);
        updateLiveStats();
    </script>
</body>
</html>`;
    
    res.send(html);
});

app.listen(PORT, () => {
    console.log('🎪 دموی تعاملی در حال اجرا: http://localhost:' + PORT);
});

// راه‌اندازی سرور اصلی اگر وجود ندارد
const { exec } = require('child_process');
exec('pgrep -f "node.*tetra-server"', (error, stdout) => {
    if (!stdout) {
        console.log('🚀 راه‌اندازی سرور اصلی Tetra...');
        exec('node tetra-server.js &');
    } else {
        console.log('✅ سرور اصلی از قبل در حال اجراست');
    }
});
