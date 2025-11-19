const express = require('express');
const app = express();
const PORT = 3001; // استفاده از پورت متفاوت

app.use(express.json());

// تست ساده‌ترین API‌ها
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: '✅ تست موفق', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      modules: 12,
      nlpPosts: 154,
      balance: 50000,
      status: 'active'
    }
  });
});

app.post('/api/demo/:type', (req, res) => {
  res.json({
    success: true,
    message: `دمو ${req.params.type} اجرا شد`,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🧪 سرور تست روی پورت ${PORT} راه‌اندازی شد`);
  console.log(`🌐 آدرس: http://localhost:${PORT}`);
  console.log('📌 تست‌های موجود:');
  console.log('  GET  /api/test');
  console.log('  GET  /api/stats');
  console.log('  POST /api/demo/nlp');
  console.log('  POST /api/demo/blockchain');
});
