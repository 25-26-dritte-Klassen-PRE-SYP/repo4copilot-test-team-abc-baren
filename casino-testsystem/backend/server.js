const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const rootEnvPath = path.resolve(__dirname, '..', '.env');
const backendEnvPath = path.resolve(__dirname, '.env');
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath;

require('dotenv').config({ path: envPath });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

app.get('/', (req, res) => {
  res.send('Backend läuft');
});

app.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id');
  res.json(result.rows);
});

app.post('/items', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO items (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await pool.query(
    'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );

  res.json(result.rows[0]);
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM items WHERE id = $1', [id]);

  res.json({ message: 'Item gelöscht' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server läuft');
});