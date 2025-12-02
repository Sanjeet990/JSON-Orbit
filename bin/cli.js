#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import http from 'http';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the dist directory
const distDir = resolve(__dirname, '..', 'dist');

// Check if dist folder exists
if (!fs.existsSync(distDir)) {
  console.error('Error: Application has not been built yet.');
  console.error('Please run "npm run build" in the project directory first.');
  process.exit(1);
}

// MIME type map
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Remove query string and normalize path
  let filePath = req.url.split('?')[0];
  
  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Serve from dist directory
  const fullPath = resolve(distDir, filePath.slice(1));
  
  // Security check: prevent directory traversal
  if (!fullPath.startsWith(distDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Try to serve the file
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // If file not found and it's not an asset, serve index.html (SPA routing)
      if (err.code === 'ENOENT' && !path.extname(filePath)) {
        fs.readFile(resolve(distDir, 'index.html'), (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }

    // Set content type
    const ext = path.extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 5173;

server.listen(PORT, () => {
  console.log(`\n✨ JSON Orbit is running at http://localhost:${PORT}\n`);
  console.log(`Press Ctrl+C to stop the server\n`);
});
