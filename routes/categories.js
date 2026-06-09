const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// 🔹 Connexion MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gcb_db"
});

// =======================
// 🔹 GET /api/categories
// =======================
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categories ORDER BY nom ASC';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: 'Erreur SQL' });
    }
    res.json(rows);
  });
});

// =======================
// 🔹 POST /api/categories
// =======================
router.post('/', (req, res) => {
  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ success: false, message: 'Le champ nom est requis' });
  }

  const sql = 'INSERT INTO categories (nom) VALUES (?)';
  db.query(sql, [nom], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: 'Erreur SQL' });
    }
    res.json({ success: true, id: result.insertId, message: 'Catégorie ajoutée' });
  });
});

// =======================
// 🔹 PUT /api/categories/:id
// =======================
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ success: false, message: 'Le champ nom est requis' });
  }

  const sql = 'UPDATE categories SET nom = ? WHERE id = ?';
  db.query(sql, [nom, id], (err) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: 'Erreur SQL' });
    }
    res.json({ success: true, message: 'Catégorie mise à jour' });
  });
});

// =======================
// 🔹 DELETE /api/categories/:id
// =======================
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: 'Erreur SQL' });
    }
    res.json({ success: true, message: 'Catégorie supprimée' });
  });
});

module.exports = router;
