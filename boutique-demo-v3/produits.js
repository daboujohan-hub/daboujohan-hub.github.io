// DONNÉES PRODUITS AMÉLIORÉES
const produits = [
    {
        id: 1,
        nom: "Robe Rouge Élégante",
        categorie: "Robes",
        prix: 5000,
        emoji: "👗",
        description: "Robe rouge magnifique, parfaite pour les occasions spéciales. Coupe élégante et flatteuse.",
        matiere: "Coton premium",
        occasion: "Soirée, Mariage",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Rouge", "Noir", "Blanc"],
        demandes: 120,
        disponibilite: "En stock",
        caracteristiques: "Longueur midi | Manches courtes | Ceinture ajustée"
    },
    {
        id: 2,
        nom: "Abaya Noire Premium",
        categorie: "Abayas",
        prix: 8000,
        emoji: "👘",
        description: "Abaya de qualité supérieure, confortable et élégante. Idéale pour tous les jours.",
        matiere: "Tissu premium importé",
        occasion: "Casual, Travail",
        tailles: ["M", "L", "XL", "XXL"],
        couleurs: ["Noir", "Marron", "Gris"],
        demandes: 95,
        disponibilite: "En stock",
        caracteristiques: "Longueur maxi | Tissu léger | Poches discrètes"
    },
    {
        id: 3,
        nom: "Jupe Colorée Wax",
        categorie: "Jupes",
        prix: 4500,
        emoji: "🌈",
        description: "Jupe en tissu wax africain authentique. Motifs vibrants et colorés.",
        matiere: "Wax 100% coton",
        occasion: "Casual, Fête",
        tailles: ["S", "M", "L"],
        couleurs: ["Multicolore", "Bleu", "Orange"],
        demandes: 85,
        disponibilite: "En stock",
        caracteristiques: "Longueur genou | Taille elastique | Motifs wax"
    },
    {
        id: 4,
        nom: "Chemise Blanche Classique",
        categorie: "Vêtements Hommes",
        prix: 3500,
        emoji: "👔",
        description: "Chemise blanche incontournable pour hommes. Idéale pour tous les jours ou travail.",
        matiere: "Coton pur",
        occasion: "Casual, Travail",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Blanc", "Bleu", "Rose"],
        demandes: 110,
        disponibilite: "En stock",
        caracteristiques: "Manches longues | Coupe classique | Boutons mother-of-pearl"
    },
    {
        id: 5,
        nom: "Pantalon Noir Slim",
        categorie: "Vêtements Hommes",
        prix: 6000,
        emoji: "👖",
        description: "Pantalon noir slim, confortable et stylé. Parfait pour le travail ou la sortie.",
        matiere: "Tissu polyester mélangé",
        occasion: "Casual, Travail",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Noir", "Bleu", "Gris"],
        demandes: 78,
        disponibilite: "En stock",
        caracteristiques: "Coupe slim | Poches à l'italienne | Fermeture zip"
    },
    {
        id: 6,
        nom: "Robe Midi Fleurie",
        categorie: "Robes",
        prix: 7000,
        emoji: "🌸",
        description: "Robe midi avec motifs floraux. Parfaite pour l'été et les occasions détente.",
        matiere: "Coton imprimé",
        occasion: "Casual, Soirée",
        tailles: ["S", "M", "L"],
        couleurs: ["Rose", "Bleu", "Jaune"],
        demandes: 92,
        disponibilite: "En stock",
        caracteristiques: "Longueur midi | Manches courtes | Motifs floraux"
    },
    {
        id: 7,
        nom: "Veste Cuir Marron",
        categorie: "Blazers/Vestes",
        prix: 12000,
        emoji: "🧥",
        description: "Veste cuir marron, pièce intemporelle et élégante. Idéale pour tous les styles.",
        matiere: "Cuir véritable",
        occasion: "Travail, Soirée",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Marron", "Noir"],
        demandes: 65,
        disponibilite: "En stock",
        caracteristiques: "Longueur courte | Doublure intérieure | Poches latérales"
    },
    {
        id: 8,
        nom: "T-shirt Graphique",
        categorie: "Vêtements Hommes",
        prix: 2500,
        emoji: "👕",
        description: "T-shirt avec imprimé tendance. Simple, confortable et stylé.",
        matiere: "Coton 100%",
        occasion: "Casual",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Noir", "Blanc", "Gris"],
        demandes: 130,
        disponibilite: "En stock",
        caracteristiques: "Manches courtes | Col rond | Imprimé durable"
    },
    {
        id: 9,
        nom: "Accessoire Foulard Wax",
        categorie: "Accessoires",
        prix: 3000,
        emoji: "🎀",
        description: "Foulard en tissu wax. Tendance et très coloré. Peut être porté de mille façons!",
        matiere: "Wax 100% coton",
        occasion: "Casual, Fête",
        tailles: ["Unique"],
        couleurs: ["Multicolore"],
        demandes: 88,
        disponibilite: "En stock",
        caracteristiques: "Longueur 180cm | Motifs wax | Léger et aéré"
    },
    {
        id: 10,
        nom: "Robe de Soirée Dorée",
        categorie: "Robes",
        prix: 15000,
        emoji: "✨",
        description: "Robe de soirée élégante avec détails dorés. Pour les grands événements.",
        matiere: "Tulle et satin",
        occasion: "Soirée, Mariage",
        tailles: ["S", "M", "L"],
        couleurs: ["Or", "Argent"],
        demandes: 72,
        disponibilite: "En stock",
        caracteristiques: "Longueur maxi | Détails paillettes | Corset intégré"
    }
];

// FONCTION : Afficher produits avec détails
function afficherProduits(listeProduits = produits) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';

    if (listeProduits.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Aucun produit trouvé 😞</p>';
        return;
    }

    listeProduits.forEach(produit => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${produit.emoji}</div>
            <div class="product-info">
                <div class="product-category">${produit.categorie}</div>
                <div class="product-name">${produit.nom}</div>
                <div class="product-price">${produit.prix.toLocaleString()} F</div>
                <div class="product-meta">
                    <div><b>Tailles :</b> ${produit.tailles.join(', ')}</div>
                    <div><b>Couleurs :</b> ${produit.couleurs.length} choix</div>
                    <div><b>Matière :</b> ${produit.matiere}</div>
                </div>
                <div class="product-rating">⭐ ${produit.demandes} commandes · ✅ ${produit.disponibilite}</div>
                <button class="btn-add" onclick="ouvrirDetailProduit(${produit.id})">Voir détails</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// FONCTION : Ouvrir détail produit (AMÉLIORÉ)
function ouvrirDetailProduit(id) {
    const produit = produits.find(p => p.id === id);
    if (!produit) return;

    const modal = document.getElementById('productModal');
    const detail = document.getElementById('productDetail');

    let tailles = produit.tailles.map(t => `<button onclick="selectionnerTaille('${t}')" class="btn-taille">${t}</button>`).join('');
    let couleurs = produit.couleurs.map(c => `<button onclick="selectionnerCouleur('${c}')" class="btn-couleur">${c}</button>`).join('');

    detail.innerHTML = `
        <div class="product-detail-image">${produit.emoji}</div>
        <div class="product-detail-info">
            <div class="detail-category">${produit.categorie}</div>
            <h3>${produit.nom}</h3>
            <p class="detail-description">${produit.description}</p>
            
            <div class="detail-specs">
                <div class="spec"><strong>💰 Prix :</strong> ${produit.prix.toLocaleString()} F</div>
                <div class="spec"><strong>🧵 Matière :</strong> ${produit.matiere}</div>
                <div class="spec"><strong>🎯 Occasion :</strong> ${produit.occasion}</div>
                <div class="spec"><strong>📏 Caractéristiques :</strong> ${produit.caracteristiques}</div>
                <div class="spec"><strong>✅ Disponibilité :</strong> ${produit.disponibilite}</div>
            </div>

            <div style="margin-bottom: 15px;">
                <strong>👕 Tailles :</strong><br>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                    ${tailles}
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <strong>🎨 Couleurs :</strong><br>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                    ${couleurs}
                </div>
            </div>

            <div class="quantity-selector">
                <button onclick="diminuerQuantite()">−</button>
                <input type="number" id="quantite" value="1" min="1">
                <button onclick="augmenterQuantite()">+</button>
            </div>

            <button class="btn-primary" onclick="ajouterAuPanier(${id})">
                Ajouter au Panier 🛒
            </button>
        </div>
    `;

    modal.classList.add('active');
}

// RECHERCHE
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const resultats = produits.filter(p => 
        p.nom.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.categorie.toLowerCase().includes(search)
    );
    afficherProduits(resultats);
});

// TRI
document.getElementById('filterSort')?.addEventListener('change', (e) => {
    let sorted = [...produits];

    if (e.target.value === 'popular') {
        sorted.sort((a, b) => b.demandes - a.demandes);
    } else if (e.target.value === 'price-low') {
        sorted.sort((a, b) => a.prix - b.prix);
    } else if (e.target.value === 'price-high') {
        sorted.sort((a, b) => b.prix - a.prix);
    }

    afficherProduits(sorted);
});

// FERMER MODALS
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').classList.remove('active');
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Afficher produits au chargement
afficherProduits();
