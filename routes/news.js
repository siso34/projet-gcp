const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// 🔹 Connexion MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gcb_db"
});

// =======================
// 🔹 GET /api/news (toutes les actualités ou filtrées par nom de catégorie)
// =======================
router.get("/", (req, res) => {
  const { categorie } = req.query;

  let sql = `
    SELECT id, titre, contenu, image, categorie, date_publication
    FROM news
  `;
  let params = [];

  if (categorie) {
    sql += " WHERE categorie = ?";
    params.push(categorie);
  }

  sql += " ORDER BY date_publication DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});

// =======================
// 🔹 POST /api/news (ajouter une actualité)
// =======================
router.post("/", (req, res) => {
  const { titre, contenu, image, categorie } = req.body;
  if (!titre || !contenu || !categorie) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }

  const sql = "INSERT INTO news (titre, contenu, image, categorie, date_publication) VALUES (?, ?, ?, ?, NOW())";
  db.query(sql, [titre, contenu, image, categorie], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
    res.json({ success: true, id: result.insertId, message: "Actualité ajoutée" });
  });
});

// =======================
// 🔹 PUT /api/news/:id (modifier une actualité)
// =======================
router.put("/:id", (req, res) => {
  const { titre, contenu, image, categorie } = req.body;

  const sql = "UPDATE news SET titre = ?, contenu = ?, image = ?, categorie = ? WHERE id = ?";
  db.query(sql, [titre, contenu, image, categorie, req.params.id], (err, result) => {   // ✅ ajout de result
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
    if (result.affectedRows === 0) {   // ✅ maintenant result existe
      return res.status(404).json({ success: false, message: "Actualité introuvable" });
    }

    res.json({ success: true, message: "Actualité mise à jour" });
  });
});

// =======================
// 🔹 DELETE /api/news/:id (supprimer une actualité)
// =======================
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM news WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {   // ✅ ajout de result
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
    if (result.affectedRows === 0) {   // ✅ maintenant result existe
      return res.status(404).json({ success: false, message: "Actualité introuvable" });
    }

    res.json({ success: true, message: "Actualité supprimée" });
  });
});

module.exports = router;
