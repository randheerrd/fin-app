// Minimal local stand-in for Vercel's dev server: runs the api/**.js handlers
// directly over plain Node http, so /api/aa/* and /api/otp/* work without a
// Vercel account. Vite proxies /api to this server (see vite.config.js).
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'api');

// Load .env.local (falls back to .env) into process.env — no dotenv dependency needed.
for (const name of ['.env', '.env.local']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m || m[1].startsWith('#')) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/, '');
  }
}

const PORT = process.env.DEV_API_PORT || 3001;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const routePath = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
    const filePath = path.join(apiDir, `${routePath}.js`);
    if (!filePath.startsWith(apiDir) || !fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `No handler for ${url.pathname}` }));
      return;
    }
    const mod = await import(pathToFileURL(filePath).href + `?t=${Date.now()}`);
    req.query = Object.fromEntries(url.searchParams);
    const jsonRes = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        res.statusCode = this.statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
      setHeader: res.setHeader.bind(res),
      end: res.end.bind(res),
    };
    await mod.default(req, jsonRes);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(PORT, () => console.log(`[dev-api] listening on http://localhost:${PORT}`));
