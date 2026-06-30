require('dotenv').config();
const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.argv[2];

if (!url) {
  console.error('Please provide your public HTTPS URL (e.g., ngrok url or production url).');
  console.error('Usage: node register-webhook.js https://your-domain.com/api/telegram/webhook');
  process.exit(1);
}

https.get(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(url)}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response from Telegram:');
    console.log(JSON.parse(data));
  });
});
