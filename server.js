const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function getMime(ext) {
  return (MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream');
}

function fileExists(fp) {
  try {
    return fs.statSync(fp).isFile();
  } catch {
    return false;
  }
}
function isDirectory(fp) {
  try {
    return fs.statSync(fp).isDirectory();
  } catch {
    return false;
  }
}

const PORT = process.env.PORT || 3000;
const serverRoot = ROOT;

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url);
    let pathname = decodeURIComponent(parsed.pathname || '/');

    // Basic sanitation
    pathname = pathname.replace(/[\r\n]+/g, '');
    // Normalize and prevent path traversal
    let relativePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let absolutePath = path.join(serverRoot, relativePath);

    if (!absolutePath.startsWith(serverRoot)) {
      absolutePath = serverRoot;
    }

    // If directory, try to serve index.html within
    if (isDirectory(absolutePath)) {
      const indexPath = path.join(absolutePath, 'index.html');
      absolutePath = fileExists(indexPath) ? indexPath : path.join(serverRoot, 'index.html');
    }

    if (fileExists(absolutePath)) {
      const ext = path.extname(absolutePath);
      const mime = getMime(ext);
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(absolutePath).pipe(res);
      return;
    } else {
      // SPA fallback: serve root index.html if present
      const rootIndex = path.join(serverRoot, 'index.html');
      if (fileExists(rootIndex)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(rootIndex).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: The requested resource could not be found on this server.');
      }
      return;
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Static Pigment-Web server running at http://localhost:${PORT}/`);
});