const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

console.log('🚀 Tetra Ecosystem Server Started');
console.log('Port:', PORT);

// داده‌های سیستم
const systemData = {
  modules: [
    { id: 1, name: 'Tetra AI Core', status: 'active', price: 10000 },
    { id: 2, name: 'Tetra Chain', status: 'active', price: 15000 },
    { id: 3, name: 'Tetra Security', status: 'active', price: 8000 },
    { id: 4, name: 'Tetra Analytics', status: 'active', price: 7000 },
    { id: 5, name: 'Tetra Web', status: 'active', price: 6000 },
    { id: 6, name: 'Tetra Mobile', status: 'active', price: 9000 },
    { id: 7, name: 'Tetra Cloud', status: 'active', price: 12000 },
    { id: 8, name: 'Tetra Automation', status: 'active', price: 8500 },
    { id: 9, name: 'Tetra Finance', status: 'active', price: 11000 },
    { id: 10, name: 'Tetra Commerce', status: 'active', price: 9500 },
    { id: 11, name: 'Tetra Gaming', status: 'active', price: 13000 },
    { id: 12, name: 'Tetra NLP', status: 'active', price: 10500 }
  ],
  nlpPosts: 154,
  balance: 50000,
  onlineUsers: 15
};

// API Routes
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      modules: systemData.modules.length,
      nlpPosts: systemData.nlpPosts,
      balance: systemData.balance,
      onlineUsers: systemData.onlineUsers,
      status: 'active'
    }
  });
});

app.get('/api/modules', (req, res) => {
  res.json({
    success: true,
    data: systemData.modules
  });
});

app.post('/api/demo/:type', (req, res) => {
  const { type } = req.params;
  const messages = {
    nlp: { message: 'NLP analysis completed', details: 'Text processing with 98% accuracy' },
    blockchain: { message: 'Blockchain transaction confirmed', details: '500 TETRA transferred successfully' },
    ai: { message: 'AI model trained', details: 'Training progress: 95% - Accuracy: 97%' },
    security: { message: 'Security test passed', details: 'Two-factor authentication activated' }
  };

  const response = messages[type] || { message: 'Operation completed', details: 'Tetra system active' };
  
  res.json({
    success: true,
    ...response,
    timestamp: new Date().toISOString()
  });
});

// صفحه اصلی
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tetra Ecosystem - Vercel</title>
    <style>
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63);
            color: white;
            font-family: Tahoma;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #00ff88;
        }
        .stats {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .btn {
            background: #00ff88;
            color: black;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            margin: 5px;
            cursor: pointer;
        }
        .result {
            background: rgba(0,255,136,0.1);
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Tetra Ecosystem - Vercel</h1>
        <p>سیستم با موفقیت راه‌اندازی شد</p>
        
        <div class="stats">
            <h3>📊 آمار سیستم</h3>
            <p>ماژول‌ها: ۱۲ | پردازش NLP: ۱۵۴ | موجودی: ۵۰,۰۰۰ TETRA</p>
        </div>
        
        <div>
            <button class="btn" onclick="testAPI('stats')">📊 تست API Stats</button>
            <button class="btn" onclick="testAPI('modules')">🏗️ تست API Modules</button>
            <button class="btn" onclick="testAPI('demo/nlp')">🧠 تست دمو NLP</button>
            <button class="btn" onclick="testAPI('demo/blockchain')">⛓️ تست دمو بلاکچین</button>
        </div>
        
        <div id="results"></div>
    </div>
    
    <script>
        async function testAPI(endpoint) {
            const method = endpoint.startsWith('demo') ? 'POST' : 'GET';
            const url = '/api/' + endpoint;
            
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                document.getElementById('results').innerHTML = 
                    '<div class="result">' +
                    '<strong>✅ موفق:</strong> ' + endpoint +
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                    '</div>';
                
            } catch (error) {
                document.getElementById('results').innerHTML = 
                    '<div style="background: rgba(255,0,0,0.1); padding: 15px; border-radius: 5px;">' +
                    '<strong>❌ خطا:</strong> ' + endpoint +
                    '<p>' + error.message + '</p>' +
                    '</div>';
            }
        }
    </script>
</body>
</html>`;
  
  res.send(html);
});

// Export for Vercel
module.exports = app;

// Start server if not in Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Tetra Ecosystem server running on port ' + PORT);
  });
}
