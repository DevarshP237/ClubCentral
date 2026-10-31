const http = require('http');

const endpoints = [
  'http://localhost:8089/index.html',
  'http://localhost:8089/club.html?id=lavasa-trekkers',
  'http://localhost:8089/club.html?id=varsity-esports',
  'http://localhost:8089/club.html?id=pika-play',
  'http://localhost:8089/assets/christ-official-white-logo.png',
  'http://localhost:8089/assets/logos/2.png',
  'http://localhost:8089/assets/logos/20.png',
  'http://localhost:8089/css/floema.css',
  'http://localhost:8089/js/data.js',
  'http://localhost:8089/js/floema-3d.js',
  'http://localhost:8089/js/floema-loader.js',
  'http://localhost:8089/js/club.js',
  'http://localhost:8089/js/app.js'
];

async function check() {
  for (const url of endpoints) {
    await new Promise(resolve => {
      http.get(url, (res) => {
        console.log(`${res.statusCode} -> ${url}`);
        resolve();
      }).on('error', err => {
        console.error(`ERR -> ${url}: ${err.message}`);
        resolve();
      });
    });
  }
}

check();
