// فایل تست خودکار برای API‌ها
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const tests = [
  { name: 'API Stats', path: '/api/stats', method: 'GET' },
  { name: 'API Modules', path: '/api/modules', method: 'GET' },
  { name: 'Demo NLP', path: '/api/demo/nlp', method: 'POST' },
  { name: 'Demo Blockchain', path: '/api/demo/blockchain', method: 'POST' }
];

console.log('🧪 شروع تست خودکار API‌ها...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(test, index) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.success !== undefined) {
            console.log(`✅ ${test.name} - موفق`);
            passedTests++;
          } else {
            console.log(`❌ ${test.name} - خطا: پاسخ نامعتبر`);
            console.log(`   پاسخ: ${data}`);
            failedTests++;
          }
        } catch (e) {
          console.log(`❌ ${test.name} - خطا در parsing JSON`);
          console.log(`   پاسخ: ${data}`);
          failedTests++;
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${test.name} - خطای شبکه: ${error.message}`);
      failedTests++;
      resolve();
    });

    req.end();
  });
}

async function runAllTests() {
  // صبر کن سرور راه‌اندازی بشه
  await new Promise(resolve => setTimeout(resolve, 2000));

  for (let i = 0; i < tests.length; i++) {
    await runTest(tests[i], i);
  }

  console.log('\n📊 نتایج نهایی تست:');
  console.log(`✅ تست‌های موفق: ${passedTests}`);
  console.log(`❌ تست‌های ناموفق: ${failedTests}`);
  console.log(`📈 میزان موفقیت: ${((passedTests / tests.length) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 همه تست‌ها با موفقیت passed شدند!');
    process.exit(0);
  } else {
    console.log('\n💡 برخی تست‌ها failed شدند. نیاز به بررسی دارد.');
    process.exit(1);
  }
}

// اگر سرور در حال اجرا نیست، آن را راه‌اندازی کن
const app = require('./api/index.js');
console.log('🔧 سرور تست در حال راه‌اندازی...');

// بعد از 1 ثانیه تست‌ها را اجرا کن
setTimeout(runAllTests, 1000);
