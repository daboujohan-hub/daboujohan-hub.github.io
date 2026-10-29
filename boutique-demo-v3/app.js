// PANIER
let panier = [];
let tailleSélectionnée = '';
let couleurSélectionnée = '';
let quantitéSélectionnée = 1;

// FONCTION : Ajouter au panier
function ajouterAuPanier(id) {
    const produit = produits.find(p => p.id === id);
    if (!produit) return;

    if (produit.tailles.length > 1 && !tailleSélectionnée) {
        alert('Choisis une taille! 👕');
        return;
    }

    if (produit.couleurs.length > 1 && !couleurSélectionnée) {
        alert('Choisis une couleur! 🎨');
        return;
    }

    const item = {
        id: id,
        nom: produit.nom,
        prix: produit.prix,
        taille: tailleSélectionnée || 'Unique',
        couleur: couleurSélectionnée || produit.couleurs[0],
        quantite: quantitéSélectionnée,
        emoji: produit.emoji
    };

    panier.push(item);
    mettreAJourPanier();
    
    document.getElementById('productModal').classList.remove('active');
    alert(`✅ ${produit.nom} ajouté au panier!`);
    
    // Reset
    tailleSélectionnée = '';
    couleurSélectionnée = '';
    quantitéSélectionnée = 1;
}

// FONCTION : Mettre à jour panier
function mettreAJourPanier() {
    const cartCount = document.getElementById('cartIcon').querySelector('.cart-count');
    cartCount.textContent = panier.length;
    
    afficherPanier();
}

// FONCTION : Afficher panier
function afficherPanier() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';

    if (panier.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Panier vide 😞</p>';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    panier.forEach((item, index) => {
        const total = item.prix * item.quantite;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.nom}</div>
                <div style="font-size: 12px; color: #666;">
                    Taille: ${item.taille} | Couleur: ${item.couleur} | Quantité: ${item.quantite}
                </div>
                <div class="cart-item-price">${total.toLocaleString()} F</div>
            </div>
            <button class="cart-remove" onclick="supprimerDuPanier(${index})">Supprimer</button>
        `;
        container.appendChild(cartItem);
    });

    // Total
    const totalGeneral = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    document.getElementById('totalPrice').textContent = totalGeneral.toLocaleString();
    document.getElementById('checkoutBtn').disabled = false;
}

// FONCTION : Supprimer du panier
function supprimerDuPanier(index) {
    panier.splice(index, 1);
    mettreAJourPanier();
}

// FONCTION : Ouvrir panier
document.getElementById('cartIcon')?.addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('active');
});

// FONCTION : Quantité
function augmenterQuantite() {
    const input = document.getElementById('quantite');
    input.value = parseInt(input.value) + 1;
    quantitéSélectionnée = parseInt(input.value);
}

function diminuerQuantite() {
    const input = document.getElementById('quantite');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        quantitéSélectionnée = parseInt(input.value);
    }
}

// FONCTION : Sélectionner taille
function selectionnerTaille(taille) {
    tailleSélectionnée = taille;
    document.querySelectorAll('.btn-taille').forEach(btn => {
        btn.style.background = btn.textContent === taille ? '#1a472a' : '#f5f5f5';
        btn.style.color = btn.textContent === taille ? 'white' : '#333';
    });
}

// FONCTION : Sélectionner couleur
function selectionnerCouleur(couleur) {
    couleurSélectionnée = couleur;
    document.querySelectorAll('.btn-couleur').forEach(btn => {
        btn.style.background = btn.textContent === couleur ? '#ffd700' : '#f5f5f5';
        btn.style.color = btn.textContent === couleur ? '#333' : '#333';
    });
}

// STYLE BOUTONS TAILLE/COULEUR
const style = document.createElement('style');
style.textContent = `
    .btn-taille, .btn-couleur {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f5f5f5;
        cursor: pointer;
        transition: 0.3s;
    }
    .btn-taille:hover, .btn-couleur:hover {
        border-color: #1a472a;
    }
`;
document.head.appendChild(style);

// FONCTION : COMMANDE WHATSAPP (avec infos client)
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (panier.length === 0) {
        alert('Panier vide!');
        return;
    }

    const nom = document.getElementById('clientNom').value.trim();
    const tel = document.getElementById('clientTel').value.trim();
    const ville = document.getElementById('clientVille').value.trim();
    const quartier = document.getElementById('clientQuartier').value.trim();

    if (!nom || !tel || !ville || !quartier) {
        alert('Remplis ton nom, téléphone, ville et quartier 📝');
        return;
    }

    let message = "🛍️ *NOUVELLE COMMANDE*\n";
    message += "==================\n\n";

    let totalGeneral = 0;
    panier.forEach(item => {
        const total = item.prix * item.quantite;
        totalGeneral += total;
        message += `${item.emoji} *${item.nom}*\n`;
        message += `   Taille: ${item.taille} | Couleur: ${item.couleur}\n`;
        message += `   Quantité: ${item.quantite} x ${item.prix.toLocaleString()}F = ${total.toLocaleString()}F\n\n`;
    });

    message += "==================\n";
    message += `💰 *TOTAL: ${totalGeneral.toLocaleString()} F*\n\n`;
    message += "📝 *Informations client:*\n";
    message += `Nom: ${nom}\n`;
    message += `Téléphone: ${tel}\n`;
    message += `Ville: ${ville}\n`;
    message += `Quartier: ${quartier}\n\n`;
    message += "✅ Merci de confirmer cette commande!";

    const phoneNumber = "225" + "0565961287";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    setTimeout(() => {
        panier = [];
        mettreAJourPanier();
        document.getElementById('cartModal').classList.remove('active');
    }, 500);
});

// Afficher panier au départ
mettreAJourPanier();


// CATÉGORIES
let categorieActive = 'Tout';

function afficherCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    const cats = ['Tout', ...new Set(produits.map(p => p.categorie))];
    container.innerHTML = '';
    cats.forEach(cat => {
        const b = document.createElement('button');
        b.className = 'cat-btn' + (cat === categorieActive ? ' active' : '');
        b.textContent = cat;
        b.onclick = () => {
            categorieActive = cat;
            afficherCategories();
            afficherProduits(cat === 'Tout' ? produits : produits.filter(p => p.categorie === cat));
        };
        container.appendChild(b);
    });
}
afficherCategories();
