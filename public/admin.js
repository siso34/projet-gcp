let allNews = [];

// Charger la liste des actus au démarrage

  document.addEventListener("DOMContentLoaded", () => {
  chargerNews();




  // Gestion de l'ajout / modification
  document.getElementById("newsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("✅ Bouton Publier cliqué !");


    const idCache = document.getElementById("newsForm").dataset.editId || null;
    const titre = document.getElementById("titre").value.trim();
    const contenu = document.getElementById("contenu").value.trim();
    const image = document.getElementById("image").value.trim();
    const categorie = document.getElementById("categorie").value;

    if (!titre || !contenu || !categorie) {
      alert("⚠️ Tous les champs requis doivent être remplis !");
      return;
    }

    let res;
    if (idCache) {
      // === Modifier ===
      res = await fetch(`http://localhost:3000/api/news${idCache}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, contenu, image, categorie })
      });
      alert("✅ Actualité modifiée !");
      delete document.getElementById("newsForm").dataset.editId;
    } else {
      // === Ajouter ===
      res = await fetch("http://localhost:3000/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, contenu, image, categorie })
      });
      alert("✅ Actualité publiée !");
    }

    document.getElementById("newsForm").reset();
    chargerNews();
  });
});

// Charger toutes les news
async function chargerNews() {
  const res = await fetch("http://localhost:3000/api/news");
  const news = await res.json();

  const newsList = document.getElementById("newsList");
  newsList.innerHTML = "";

  news.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("news-item");

    div.innerHTML = `
      <h3>${item.titre}</h3>
      <p>${item.contenu}</p>
      ${item.image ? `<img src="${item.image}" alt="">` : ""}
      <span class="badge ${item.categorie.toLowerCase()}">${item.categorie}</span>
      <div class="actions">
        <button class="modify" onclick="modifierNews(${item.id}, '${item.titre.replace(/'/g, "\\'")}', '${item.contenu.replace(/'/g, "\\'")}', '${item.image || ""}', '${item.categorie}')">
          <i class="fas fa-pen"></i> Modifier
        </button>
        <button class="danger" onclick="supprimerNews(${item.id})">
          <i class="fas fa-trash"></i> Supprimer
        </button>
      </div>
    `;

    newsList.appendChild(div);
  });
}

// Supprimer une news
async function supprimerNews(id) {
  if (!confirm("⚠️ Voulez-vous vraiment supprimer cette actu ?")) return;

  await fetch(`http://localhost:3000/api/news/${id}`, { method: "DELETE" });
  alert("🗑️ Actualité supprimée !");
  chargerNews();
}

// Préparer la modification
function modifierNews(id, titre, contenu, image, categorie) {
  document.getElementById("titre").value = titre;
  document.getElementById("contenu").value = contenu;
  document.getElementById("image").value = image;
  document.getElementById("categorie").value = categorie;

  document.getElementById("newsForm").dataset.editId = id;
  alert("✏️ Vous modifiez cette actu, changez les champs puis cliquez sur Publier.");
}
