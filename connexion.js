// connexion.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // ton utilisateur MySQL
    password: '',        // ton mot de passe MySQL
    database: 'gcb_db'   // nom de ta base de données
});

// Vérifier la connexion
db.connect((err) => {
    if (err) {
        console.error('❌ Erreur MySQL :', err.message);
    } else {
        console.log('✅ Connecté à MySQL');
    }
});

module.exports = db;
