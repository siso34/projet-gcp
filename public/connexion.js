document.getElementById('connexionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const Mot_de_passe = document.getElementById('Mot_de_passe').value;

    if (!email || !Mot_de_passe) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    fetch('http://localhost:3000/connexion', { // ✅ route correcte
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, Mot_de_passe }) // ✅ noms identiques à server.js
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            alert(data.message); // Affiche "Connexion réussie"
            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error("Erreur :", err);
        alert("Erreur de connexion au serveur.");
    });
});
