const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

const dbPath = path.resolve(__dirname, '../projeto-sqlite/banco.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

app.use(express.json());

app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: rows });
    }
  });
});

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;
  const sql = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
  db.run(sql, [nome, email], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, nome, email });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});