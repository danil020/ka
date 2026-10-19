const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 3000);
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'praktikum_user',
  password: process.env.DB_PASSWORD || 'latihan_app_password',
  database: process.env.DB_NAME || 'praktikum_db',
  waitForConnections: true,
  connectionLimit: 5
};

let pool;

async function initializeDatabase() {
  pool = mysql.createPool(dbConfig);
  await pool.query(`CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html><html lang="id"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"><title>Praktikum Jenkins</title></head>
  <body style="font-family:Arial,sans-serif;max-width:760px;margin:50px auto;padding:0 20px">
  <h1>Web Data Mahasiswa</h1><p>Aplikasi Node.js berjalan di Docker dan terhubung ke MySQL.</p>
  <p>Data mahasiswa: <a href="/api/students">/api/students</a></p>
  <p>Status database: <a href="/health">/health</a></p></body></html>`);
});

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (_error) {
    res.status(503).json({ status: 'error', message: 'Database belum terhubung' });
  }
});

app.get('/api/students', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, major, created_at FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (_error) {
    res.status(500).json({ error: 'Gagal mengambil data mahasiswa' });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, major } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof major !== 'string' || !major.trim()) {
    return res.status(400).json({ error: 'name dan major wajib diisi' });
  }
  try {
    const [result] = await pool.execute('INSERT INTO students (name, major) VALUES (?, ?)', [name.trim(), major.trim()]);
    res.status(201).json({ id: result.insertId, name: name.trim(), major: major.trim() });
  } catch (_error) {
    res.status(500).json({ error: 'Gagal menyimpan data mahasiswa' });
  }
});

async function start() {
  let lastError;
  for (let attempt = 1; attempt <= 20; attempt++) {
    try {
      await initializeDatabase();
      app.listen(port, '0.0.0.0', () => console.log(`Aplikasi berjalan di port ${port}`));
      return;
    } catch (error) {
      lastError = error;
      console.log(`Menunggu database (${attempt}/20)...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  console.error('Database tidak dapat dihubungi:', lastError.message);
  process.exit(1);
}

if (require.main === module) start();
module.exports = app;
