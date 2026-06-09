document.getElementById("inscriptionForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Empêche le rechargement

    const Nom = document.getElementById("Nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const Mot_de_passe = document.getElementById("Mot_de_passe").value.trim();
    const role = document.getElementById("role").value;

    // Envoi au serveur
    fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nom, email, Mot_de_passe, role })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Réponse serveur :", data);

        if (data.success) {
            // Redirection directe vers user.html
            window.location.href = "user.html";
        } else {
            alert(data.message || "Erreur lors de l'inscription");
        }
    })
    .catch(err => {
        console.error("Erreur fetch :", err);
        alert("Impossible de se connecter au serveur.");
    });
});
