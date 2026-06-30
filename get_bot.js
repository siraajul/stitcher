const https = require('https');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_TOKEN;
https.get(`https://api.telegram.org/bot${token}/getMe`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
