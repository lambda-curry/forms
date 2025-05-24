const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let filePath = path.join(__dirname, 'storybook-static', req.url === '/' ? 'index.html' : req.url);
  
  // If file doesn't exist, serve index.html for SPA routing
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'storybook-static', 'index.html');
  }
  
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  }[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error reading file:', filePath, err);
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const PORT = 45678;
server.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

