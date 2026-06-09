// -------------------------
// Fonction qui crée une carte actu
// -------------------------
function createNewsCard(news) {
  const card = document.createElement('div');
  card.classList.add('news-card');

  // Image (BDD ou défaut)
  const img = document.createElement('img');
  img.src = news.image || "https://via.placeholder.com/300x180?text=No+Image";
  img.alt = news.titre;
  card.appendChild(img);

  const content = document.createElement('div');
  content.classList.add('contenu');

  // Titre
  const titre = document.createElement('h3');
  titre.textContent = news.titre;
  content.appendChild(titre);

  // Contenu
  const p = document.createElement('p');
  p.textContent = news.contenu;
  content.appendChild(p);

  card.appendChild(content);
  return card;
}

// -------------------------
// Fonction pour charger les actus d'une catégorie
// -------------------------
function loadCategory(categorie) {
  fetch(`http://localhost:3000/api/news?categorie=${categorie}`)
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector('.news-section');
      container.innerHTML = '';

      if (data.length === 0) {
        container.innerHTML = "<p>Aucune actualité trouvée pour cette catégorie.</p>";
        return;
      }

      data.forEach(news => {
        const card = createNewsCard(news);
        container.appendChild(card);
      });
    })
    .catch(err => console.error("Erreur :", err));
}

// -------------------------
//verification 
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const categorie = params.get("categorie");

  if (categorie) {
    document.getElementById("titre-categorie").textContent = `Actualités - ${categorie}`;
    loadCategory(categorie); // charge les actus depuis ton API
  }
};

    // Titre de la page dynamique
    const titrePage = document.getElementById("titre-categorie");
    if (titrePage) {
      titrePage.textContent = `Actualités - ${categorie}`;
    }

    // Charger les actus
    loadCategory(categorie);
  

