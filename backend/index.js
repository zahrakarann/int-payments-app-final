const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('./server');

const PORT = process.env.PORT || 5000;
const useHttps = process.env.ENABLE_HTTPS === 'true';

if (useHttps) {
  const keyPath = path.join(__dirname, 'keys', 'server.key');
  const certPath = path.join(__dirname, 'keys', 'server.cert');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error('❌ SSL certificate files missing in keys/ folder!');
    console.error('Expected files: server.key & server.cert');
    process.exit(1);
  }

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    minVersion: 'TLSv1.2'
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
  });

} else {
  app.listen(PORT, () => {
    console.log(`🌐 HTTP Server running at http://localhost:${PORT}`);
  });
}
