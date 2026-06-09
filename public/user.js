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

  // Contenu court
  const p = document.createElement('p');
  let shortText = news.contenu.substring(0, 200);
  let isLong = news.contenu.length > 200;

  p.innerHTML = shortText;
  if (isLong) {
    const more = document.createElement('span');
    more.classList.add('more-text');
    more.style.display = 'none';
    more.textContent = news.contenu.substring(200);
    p.appendChild(more);
  }

  // 🔹 On ajoute le paragraphe avant le bouton
  content.appendChild(p);

  // Bouton "Lire plus" (après le texte)
  if (isLong) {
    const btn = document.createElement('button');
    btn.textContent = "Lire plus";
    btn.classList.add('lire-plus');

    btn.addEventListener("click", () => {
      if (p.querySelector('.more-text').style.display === "none") {
        p.querySelector('.more-text').style.display = "inline";
        btn.textContent = "Lire moins";
      } else {
        p.querySelector('.more-text').style.display = "none";
        btn.textContent = "Lire plus";
      }
    });

    content.appendChild(btn);
  }

  card.appendChild(content);
  return card;
}

// -------------------------
// Fonction pour charger une catégorie (ou toutes les actus)
// -------------------------
function loadCategory(categorie = null) {
  let url;

  if (categorie) {
    // Vérifie si c'est un ID numérique ou un nom
    if (!isNaN(categorie)) {
      url = `http://localhost:3000/api/news/categorie/${categorie}`;
    } else {
      url = `http://localhost:3000/api/news?categorie=${encodeURIComponent(categorie)}`;
    }
  } else {
    // Toutes les actus
    url = "http://localhost:3000/api/news";
  }

  // ⚡ éviter le cache
  url += (url.includes("?") ? "&" : "?") + "nocache=" + Date.now();

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector('.news-section');
      container.innerHTML = ''; // vider avant d'afficher

      if (!data || data.length === 0) {
        container.innerHTML = "<p>Aucune actualité trouvée.</p>";
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
// Charger au démarrage (avec ou sans catégorie)
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const categorie = params.get("categorie");

  loadCategory(categorie);
});

// -------------------------
// Redirection vers la page actualite.html avec paramètre
// -------------------------
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener("click", () => {
    const categorie = card.dataset.categorie;
    window.location.href = `actualite.html?categorie=${categorie}`;
  });
});
