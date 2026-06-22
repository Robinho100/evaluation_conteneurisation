const http = require('http');
const redis = require('redis');

const PORT = process.env.PORT || 3001;
const REDIS_HOST = process.env.REDIS_HOST || 'cache';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function start() {
  try {
    await client.connect();
    console.log('Connecté à Redis');
  } catch(e) {
    console.error('Erreur connexion Redis', e);
  }

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', message: 'Backend is running' }));
      return;
    }
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(PORT, () => {
    console.log(`Backend API écoutant sur le port ${PORT}`);
  });
}

start();
