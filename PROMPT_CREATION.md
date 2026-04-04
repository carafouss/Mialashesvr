# Prompt de Création - Site Web Mia Hairdresser

## 📋 Informations Générales

**Nom du site:** Mia Hairdresser  
**Type:** Salon de beauté professionnel  
**Téléphone/WhatsApp:** +2250708985595  
**Localisation:** Abidjan, Côte d'Ivoire

---

## 🎯 Objectifs du Site

1. Présenter les services du salon de manière professionnelle
2. Permettre la réservation en ligne via WhatsApp
3. Vendre des produits de beauté (cheveux et peau)
4. Afficher la localisation via Google Maps intégré
5. Donner accès rapide aux réseaux sociaux (Facebook, Instagram, TikTok, WhatsApp)

---

## 🎨 Style et Design

### Style Général
- **Professionnel** comme les grandes marques de beauté
- **Dynamique** avec des animations fluides qui retiennent l'attention
- **Engageant** pour pousser les clients à acheter

### Palette de Couleurs
- Couleurs élégantes et sophistiquées
- Tons chauds et accueillants
- Accent doré/bronze pour le luxe
- Fond sombre professionnel

### Typographie
- **Police titres:** Playfair Display (serif) - élégante et professionnelle
- **Police texte:** Inter (sans-serif) - moderne et lisible

### Animations
- Animations de défilement (fade-in, scale-in)
- Effets de survol sur les images
- Carrousel automatique pour les promotions
- Transitions fluides entre les sections

---

## 📸 Images et Visuels

### Représentation
- **IMPORTANT:** Utiliser des photos de personnes afro avec peau ébène
- Photos lumineuses et bien éclairées (pas de photos sombres)
- Ambiance moderne et professionnelle
- Images de haute qualité

### Sections avec images
1. **Hero:** Grand visuel du salon lumineux avec lumière naturelle
2. **À propos:** Femme africaine élégante dans un salon moderne
3. **Services:** 4 photos montrant chaque service (coupe, coloration, lissage, soins)
4. **Produits:** Photos de produits de beauté professionnels

---

## 🏗️ Structure du Site

### 1. Header (Navigation)
- Logo "Mia Hairdresser"
- Menu: Services, Produits, Localisation
- Icône panier avec compteur d'articles
- Bouton "Réserver" (lien WhatsApp)
- Menu mobile responsive

### 2. Hero Section
- Grande image de fond lumineuse du salon
- Titre principal: "Révélez votre beauté naturelle"
- Sous-titre descriptif
- 2 boutons d'action:
  - "Prendre rendez-vous" (WhatsApp)
  - "Découvrir nos produits"
- Indicateur de défilement animé

### 3. Carrousel de Promotions
- **Défilement automatique** (toutes les 4 secondes)
- **3 promotions:**
  1. **20% de réduction** - Sur paiements Wave (code: WAVE20)
  2. **Offre découverte** - Première visite -15% (code: BIENVENUE)
  3. **Pack Beauté** - Achetez 3 produits, le 4ème offert (code: 3+1)
- Navigation par points
- Design accrocheur avec couleur accent

### 4. Section À Propos
- **Histoire du salon**
  - Présentation narrative
  - Mission et valeurs
- **Badge d'expérience:** "5+ Années d'expérience"
- **4 Valeurs clés:**
  1. Excellence (icône trophée)
  2. Innovation (icône étoiles)
  3. Passion (icône cœur)
  4. Proximité (icône utilisateurs)
- Image de femme africaine élégante

### 5. Section Services
**4 services principaux avec photos de femmes afro:**

1. **Coupe & Coiffure**
   - Description: Coupes modernes et classiques
   - Prix: À partir de 15 000 FCFA
   - Bouton "Réserver" (WhatsApp)

2. **Coloration**
   - Description: Colorations professionnelles premium
   - Prix: À partir de 25 000 FCFA
   - Bouton "Réserver" (WhatsApp)

3. **Lissage & Défrisage**
   - Description: Lissage brésilien et défrisage doux
   - Prix: À partir de 30 000 FCFA
   - Bouton "Réserver" (WhatsApp)

4. **Soins Capillaires**
   - Description: Soins profonds pour cheveux secs et abîmés
   - Prix: À partir de 20 000 FCFA
   - Bouton "Réserver" (WhatsApp)

**Fonctionnalités:**
- Cartes avec effet de survol
- Zoom sur images au survol
- Icônes pour chaque service

### 6. Section Produits (E-commerce)
**6 produits de beauté premium:**

1. **Shampoing Hydratant Premium** - 12 000 FCFA
2. **Masque Réparateur Intense** - 15 000 FCFA
3. **Sérum Brillance** - 18 000 FCFA
4. **Huile de Coco Naturelle** - 10 000 FCFA
5. **Crème Hydratante Visage** - 16 000 FCFA
6. **Lait Corporel Nourrissant** - 14 000 FCFA

**Fonctionnalités par produit:**
- Image du produit
- Badge catégorie (Cheveux/Peau)
- Nom et description
- Prix en FCFA
- Sélecteur de quantité (+/-)
- Bouton "Ajouter au panier"

### 7. Section Localisation
**Informations de contact:**
- **Adresse:** Abidjan, Côte d'Ivoire
- **Téléphone/WhatsApp:** +225 07 08 98 55 95
- **Horaires:**
  - Lundi - Samedi: 9h00 - 19h00
  - Dimanche: Sur rendez-vous

**Carte Google Maps:**
- Iframe intégré
- Responsive
- Hauteur 500px

### 8. Footer
**3 colonnes:**
1. **À propos:**
   - Nom du salon
   - Description courte
2. **Liens rapides:**
   - Services
   - Produits
   - Localisation
3. **Réseaux sociaux:**
   - Facebook
   - Instagram
   - TikTok
   - WhatsApp
- Copyright avec année dynamique

---

## 🛒 Système de Panier et Commande

### Fonctionnement du Panier
- Contexte React global (CartContext)
- Sauvegarde dans localStorage
- Compteur d'articles dans le header
- Ajout/suppression/modification de quantité

### Processus de Commande (3 étapes)

#### Étape 1: Révision du panier
- Liste des produits avec images
- Ajusteur de quantité pour chaque produit
- Bouton de suppression
- Résumé avec sous-total et total
- Bouton "Passer la commande"

#### Étape 2: Formulaire de livraison
**Champs obligatoires:**
1. **Nom complet** (input texte)
2. **Adresse de livraison** (textarea)
   - Quartier
   - Rue
   - Repères
3. **Numéro de téléphone** (input tel)

#### Étape 3: Confirmation
- Bouton "Valider sur WhatsApp"
- **Message WhatsApp formaté automatiquement:**
  ```
  🛍️ NOUVELLE COMMANDE
  
  PRODUITS:
  • [Nom produit]
    Quantité: [X]
    Prix: [XXX] FCFA
  
  TOTAL: [XXX] FCFA
  
  ━━━━━━━━━━━━━━━
  INFORMATIONS DE LIVRAISON:
  👤 Nom: [Nom client]
  📍 Adresse: [Adresse complète]
  📞 Téléphone: [Numéro]
  ━━━━━━━━━━━━━━━
  ```
- Envoi automatique vers le WhatsApp du salon (+2250708985595)
- Vidage du panier après envoi
- Message de confirmation

---

## 💳 Moyens de Paiement

### Validation de commande:
1. Client remplit le formulaire de livraison
2. Toutes les informations sont envoyées sur WhatsApp
3. Le salon contacte le client pour confirmer le paiement

### Options mentionnées:
- **WhatsApp:** Contact direct
- **Wave:** 20% de réduction avec paiement Wave

---

## 🛠️ Technologies Utilisées

### Framework et Bibliothèques
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (composants UI)

### Fonctionnalités Techniques
- Responsive design (mobile-first)
- Animations CSS personnalisées
- Context API pour la gestion du panier
- localStorage pour la persistance
- Google Maps iframe
- WhatsApp Business API
- SEO optimisé
- Vercel Analytics

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Adaptations Mobile
- Menu hamburger
- Grille de produits adaptative
- Carrousel tactile
- Cartes empilées verticalement

---

## 🎯 Appels à l'Action (CTA)

### Principaux CTA
1. **"Prendre rendez-vous"** → WhatsApp
2. **"Réserver"** (services) → WhatsApp
3. **"Ajouter au panier"** (produits) → Panier
4. **"Passer la commande"** → Formulaire
5. **"Valider sur WhatsApp"** → Envoi commande

### Couleurs des boutons
- Primaire: Accent (doré/bronze)
- Secondaire: Transparent avec bordure
- Hover: Légère opacité

---

## ✅ Checklist de Fonctionnalités

- [x] Navigation fixe avec effet de scroll
- [x] Hero section avec image de fond
- [x] Carrousel de promotions automatique
- [x] Section À propos avec valeurs
- [x] Services avec réservation WhatsApp
- [x] Produits e-commerce avec panier
- [x] Gestion du panier (ajout/suppression/quantité)
- [x] Processus de commande en 3 étapes
- [x] Formulaire de livraison
- [x] Envoi automatique sur WhatsApp
- [x] Google Maps intégré
- [x] Liens réseaux sociaux
- [x] Design responsive
- [x] Animations fluides
- [x] Images de personnes afro
- [x] Photos lumineuses et bien éclairées
- [x] localStorage pour panier
- [x] Compteur panier dans header

---

## 🌍 Langue et Localisation

- **Langue:** Français
- **Devise:** FCFA (Franc CFA)
- **Format téléphone:** +225 XX XX XX XX XX
- **Fuseau horaire:** GMT (Abidjan)

---

## 📝 Notes Importantes

1. **Photos:** Toujours utiliser des photos de personnes afro avec peau ébène et éclairage lumineux
2. **WhatsApp:** Toutes les réservations et commandes passent par WhatsApp (+2250708985595)
3. **Promotions:** Le carrousel doit être visible et accrocheur
4. **Panier:** Doit être persistant même après fermeture du navigateur
5. **Mobile:** Le site doit être parfaitement fonctionnel sur mobile
6. **Animations:** Doivent être fluides mais pas excessives
7. **Performance:** Images optimisées, chargement rapide

---

## 🚀 Prompt de Création Complet

```
Crée un site web professionnel pour "Mia Hairdresser", un salon de beauté à Abidjan.

INFORMATIONS:
- Téléphone/WhatsApp: +2250708985595
- Style: Professionnel comme les grandes marques de beauté
- Public: Clientèle africaine

DESIGN:
- Couleurs élégantes et sophistiquées avec accent doré
- Polices: Playfair Display (titres) + Inter (texte)
- IMPORTANT: Utiliser des photos de personnes afro avec peau ébène
- Photos lumineuses et bien éclairées (pas sombres)
- Animations dynamiques pour retenir l'attention

STRUCTURE DU SITE:

1. HEADER
- Logo "Mia Hairdresser"
- Navigation: Services, Produits, Localisation
- Icône panier avec compteur
- Bouton "Réserver" (WhatsApp)

2. HERO
- Grande image lumineuse du salon
- Titre: "Révélez votre beauté naturelle"
- 2 CTA: "Prendre rendez-vous" et "Découvrir nos produits"

3. CARROUSEL PROMOTIONS (défilement automatique)
- 20% de réduction sur paiements Wave
- Première visite -15%
- Achetez 3 produits, le 4ème offert

4. À PROPOS
- Histoire du salon
- 4 valeurs: Excellence, Innovation, Passion, Proximité
- Badge "5+ années d'expérience"
- Photo de femme africaine élégante

5. SERVICES (avec photos de femmes afro)
- Coupe & Coiffure (15 000 FCFA)
- Coloration (25 000 FCFA)
- Lissage & Défrisage (30 000 FCFA)
- Soins Capillaires (20 000 FCFA)
- Chaque service a un bouton "Réserver" (WhatsApp)

6. PRODUITS E-COMMERCE
6 produits avec:
- Image
- Nom et description
- Prix en FCFA
- Sélecteur de quantité
- Bouton "Ajouter au panier"

Produits:
- Shampoing Hydratant (12 000 FCFA)
- Masque Réparateur (15 000 FCFA)
- Sérum Brillance (18 000 FCFA)
- Huile de Coco (10 000 FCFA)
- Crème Visage (16 000 FCFA)
- Lait Corporel (14 000 FCFA)

7. LOCALISATION
- Adresse: Abidjan, Côte d'Ivoire
- Téléphone: +225 07 08 98 55 95
- Horaires: Lun-Sam 9h-19h, Dim sur RDV
- Google Maps intégré

8. FOOTER
- Description du salon
- Liens rapides
- Réseaux sociaux: Facebook, Instagram, TikTok, WhatsApp

SYSTÈME DE PANIER:
- Contexte React global
- Sauvegarde localStorage
- Page panier dédiée avec 3 étapes:

Étape 1: Révision du panier
- Liste des produits
- Ajustement quantités
- Bouton suppression
- Total

Étape 2: Formulaire de livraison (obligatoire)
- Nom complet
- Adresse de livraison complète
- Numéro de téléphone

Étape 3: Validation
- Bouton "Valider sur WhatsApp"
- Message formaté automatiquement avec:
  * Liste des produits et quantités
  * Total
  * Informations de livraison
- Envoi vers +2250708985595
- Confirmation et vidage du panier

TECHNIQUE:
- Next.js 16 avec App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Responsive mobile-first
- Animations fluides
- SEO optimisé

IMPORTANT:
- Toutes les photos doivent montrer des personnes afro
- Éclairage lumineux et naturel
- WhatsApp pour réservations et commandes
- Design professionnel et engageant
```

---

## 📞 Contact

Pour toute question sur ce site:
- WhatsApp: +2250708985595
- Email: contact@miahairdresser.com (exemple)

---

**Document créé le:** 31 décembre 2025
**Version:** 1.0
**Créé avec:** v0 by Vercel
