const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('.'));

console.log(`
🎪 Tetra Ecosystem - Simple Demo
================================

🚀 Demo running at: http://localhost:${PORT}
📊 Main system: http://localhost:3000

✅ Demo ready!
`);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>Tetra Demo</title>
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
            }
            .demo-card {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                margin: 2rem auto;
                border-radius: 15px;
                max-width: 600px;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                margin: 10px;
                background: #00ff88;
                color: black;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎪 Tetra Ecosystem Demo</h1>
            <p style="font-size: 1.2em;">دموی ساده و تعاملی سیستم Tetra</p>
            
            <div class="demo-card">
                <h3>🚀 سیستم فعال و آماده</h3>
                <p>۱۲ ماژول Tetra Ecosystem در حال اجرا هستند</p>
                <p>🧠 ۱۵۴ پست NLP پردازش شده</p>
                <p>💰 ۵۰,۰۰۰ TETRA موجودی</p>
                
                <div style="margin-top: 2rem;">
                    <a href="http://localhost:3000" class="btn">🏠 سیستم اصلی</a>
                    <a href="http://localhost:3000/modules" class="btn">🏗️ ماژول‌ها</a>
                    <a href="http://localhost:3000/nlp" class="btn">🧠 صفحه NLP</a>
                </div>
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

app.listen(PORT, () => {
    console.log(`🌐 Demo: http://localhost:${PORT}`);
    console.log(`🏠 Main: http://localhost:3000`);
});
