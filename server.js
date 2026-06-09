const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));


// Accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connexion à MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gcb_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erreur MySQL :', err.message);
    } else {
        console.log('✅ Connecté à MySQL');
    }
});

// Test BDD
app.get('/test-db', (req, res) => {
    db.query('SELECT * FROM utilisateurs', (err, results) => {
        if (err) {
            console.error('❌ Erreur lecture table :', err);
            return res.status(500).send('Erreur lors de la lecture.');
        }
        res.json({
            message: '✅ Connexion réussie et lecture OK',
            data: results
        });
    });
});

// Connexion utilisateur
app.post('/connexion', (req, res) => {
    const { email, Mot_de_passe } = req.body;

    if (!email || !Mot_de_passe) {
        return res.json({ success: false, message: "Veuillez remplir tous les champs" });
    }

    const sql = "SELECT * FROM utilisateurs WHERE email = ? AND Mot_de_passe = ?";
    db.query(sql, [email, Mot_de_passe], (err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ success: false, message: "Erreur interne" });
        }

        if (results.length > 0) {
            res.json({ success: true, message: "Connexion réussie", role: results[0].role });
        } else {
            res.json({ success: false, message: "Email ou mot de passe incorrect" });
        }
    });
});

// Inscription utilisateur

app.post('/inscription', (req, res) => {
    console.log("📥 Données reçues du formulaire :", req.body);

    const { Nom, email, Mot_de_passe } = req.body;
    const role = req.body.role || 'user'; // Rôle par défaut "user"

    if (!Nom || !email || !Mot_de_passe) {
        return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    // Vérifier si l'email existe déjà
    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ success: false, message: "Erreur interne" });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: "Cet email est déjà enregistré" });
        }

        // Insérer le nouvel utilisateur
        const sql = "INSERT INTO utilisateurs (Nom, email, Mot_de_passe, role) VALUES (?, ?, ?, ?)";
        db.query(sql, [Nom, email, Mot_de_passe, role], (err) => {
            if (err) {
                console.error("❌ Erreur SQL (insertion) :", err);
                return res.status(500).json({ success: false, message: "Erreur lors de l'inscription" });
            }

            console.log(`✅ Utilisateur ajouté : ${Nom} (${role})`);
            return res.json({
                success: true,
                message: "Inscription réussie",
                role: role
            });
        });
    });
});
// 🔹 Routes API (categories + news)
// =======================
const categoriesRoutes = require('./routes/categories');
app.use('/api/categories', categoriesRoutes);
const newsRoutes = require('./routes/news');
app.use('/api/news', newsRoutes);




// Lancer serveur
app.listen(3000, () => {
    console.log("🚀 Serveur Node lancé sur http://localhost:3000");
});
