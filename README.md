# AideMoi / HelpMe 🤝

Plateforme de mise en relation pour services locaux avec système d'abonnement.

## 🌐 URLs

- **Développement**: https://3000-ifpa3547o1tw2scdge45b-8f57ffe2.sandbox.novita.ai
- **Production**: *À déployer sur Cloudflare Pages*

## 📋 Vue d'ensemble

**AideMoi/HelpMe** est une marketplace de services locaux qui connecte les utilisateurs avec des prestataires (professionnels ou amateurs) pour différents types de services. Les utilisateurs paient un abonnement de 20$ USD/mois pour accéder à la plateforme et rechercher des prestataires.

## ✨ Fonctionnalités actuellement complétées

### ✅ Fonctionnalités de base
- 🔍 **Recherche avancée** : Filtres par catégorie, ville, pays et type (pro/amateur)
- 🌍 **Multi-langues** : Support complet FR/EN avec traductions dynamiques
- 📊 **Statistiques** : Affichage du nombre de prestataires, services et utilisateurs
- ⭐ **Système d'évaluation** : Notes et avis pour chaque service
- 💰 **Tarification flexible** : Tarifs horaires, forfaits ou les deux
- 🏷️ **Catégories** : 12 catégories de services (ménage, plomberie, jardinage, etc.)
- 👤 **Profils prestataires** : Informations détaillées, services offerts, avis clients
- ✔️ **Badge vérification** : Distinction des prestataires vérifiés

### ✅ API REST complètes
- `GET /api/categories` - Liste des catégories (multilingue)
- `GET /api/search` - Recherche de services avec filtres
- `GET /api/providers/:id` - Détails d'un prestataire
- `POST /api/auth/check-subscription` - Vérification statut abonnement
- `GET /api/stats` - Statistiques globales de la plateforme

### ✅ Base de données Cloudflare D1
- **Tables** : users, providers, services, categories, reviews, subscription_history
- **Migrations** : Schéma complet avec index optimisés
- **Données de test** : 3 utilisateurs, 3 prestataires, 5 services, 12 catégories
- **Mode local** : Développement avec SQLite local automatique

## 🚧 Fonctionnalités non encore implémentées

### ❌ Système d'abonnement Stripe
- Intégration Stripe Checkout pour paiement $20/mois
- Webhooks pour gestion automatique des abonnements
- Gestion du statut d'abonnement et renouvellement
- Interface de gestion d'abonnement utilisateur

### ❌ Authentification utilisateur
- Inscription/connexion utilisateurs
- Hash de mots de passe sécurisé (bcrypt)
- Sessions/JWT pour authentification
- Protection des routes API

### ❌ Fonctionnalités avancées
- Messagerie entre utilisateurs et prestataires
- Système de réservation/rendez-vous
- Géolocalisation avec calcul de distance réelle
- Upload de photos pour profils et services
- Notifications par email
- Panel d'administration

## 📊 Modèles de données

### Users (Utilisateurs abonnés)
```sql
- email, password_hash, name
- subscription_status (active/inactive/cancelled)
- subscription_expires_at
- stripe_customer_id
- preferred_language (en/fr/es/de)
```

### Providers (Prestataires)
```sql
- name, email, phone, bio
- profile_type (amateur/professional)
- address, city, country
- latitude, longitude
- rating, total_reviews
- verified (boolean)
```

### Services
```sql
- title (EN/FR), description (EN/FR)
- category_id
- pricing_type (hourly/fixed/both)
- hourly_rate, fixed_price, currency
- available (boolean)
```

### Categories
```sql
- name_en, name_fr
- icon (emoji)
```

### Reviews
```sql
- service_id, user_id
- rating (1-5), comment
```

## 🗄️ Services de stockage

- **Cloudflare D1** : Base de données SQLite distribuée globalement
- **Migrations** : `/migrations/0001_initial_schema.sql`
- **Seed data** : `/seed.sql` (données de test)

## 🎨 Technologies

- **Backend** : Hono framework (Cloudflare Workers)
- **Frontend** : HTML/CSS/JS + TailwindCSS + FontAwesome
- **Database** : Cloudflare D1 (SQLite)
- **Deployment** : Cloudflare Pages
- **Process Manager** : PM2 (développement local)

## 🚀 Guide d'utilisation simple

### Rechercher des services
1. Accédez à la page d'accueil
2. Changez la langue si nécessaire (🇫🇷/🇬🇧)
3. Utilisez les filtres : catégorie, ville, pays, type
4. Cliquez sur "Search Services" / "Rechercher des Services"
5. Parcourez les résultats avec tarifs et évaluations
6. Cliquez sur "View Details" pour voir le profil complet

### Langues disponibles
- 🇬🇧 **English** : Interface complète en anglais
- 🇫🇷 **Français** : Interface complète en français

### Catégories de services
- 🧹 Ménage / Home Cleaning
- 🔧 Plomberie / Plumbing
- ⚡ Électricité / Electrical Work
- 🌱 Jardinage / Gardening
- 🎨 Peinture / Painting
- 🪚 Menuiserie / Carpentry
- 📦 Déménagement / Moving Services
- 💻 Réparation informatique / Computer Repair
- 🐕 Garde d'animaux / Pet Care
- 📚 Tutorat / Tutoring
- 🏗️ Rénovation / Home Renovation
- 🚗 Réparation automobile / Car Repair

## 💻 Commandes de développement

```bash
# Installer les dépendances
npm install

# Migrations base de données (local)
npm run db:migrate:local

# Insérer les données de test
npm run db:seed

# Réinitialiser la base locale
npm run db:reset

# Compiler le projet
npm run build

# Développement sandbox
npm run dev:sandbox

# Démarrer avec PM2
pm2 start ecosystem.config.cjs

# Nettoyer le port 3000
npm run clean-port

# Tester l'API
npm test
```

## 🎯 Prochaines étapes recommandées

1. **Intégration Stripe** (Priorité HAUTE)
   - Créer compte Stripe et obtenir API keys
   - Implémenter Stripe Checkout pour abonnements
   - Configurer webhooks pour mise à jour automatique

2. **Authentification** (Priorité HAUTE)
   - Système inscription/connexion
   - Protection des routes API
   - Sessions utilisateur

3. **Messagerie** (Priorité MOYENNE)
   - Contact entre utilisateurs et prestataires
   - Système de notifications

4. **Géolocalisation avancée** (Priorité MOYENNE)
   - Calcul de distance réelle
   - Tri par proximité
   - Carte interactive

5. **Panel administration** (Priorité BASSE)
   - Modération des services
   - Gestion des utilisateurs
   - Statistiques détaillées

## 📝 Statut du déploiement

- **Plateforme** : Cloudflare Pages
- **Statut** : ✅ Développement actif
- **Tech Stack** : Hono + TypeScript + TailwindCSS + Cloudflare D1
- **Dernière mise à jour** : 2024-01-15

## 📄 Structure du projet

```
webapp/
├── src/
│   └── index.tsx           # Application Hono principale
├── public/static/
│   └── app.js              # Frontend JavaScript (multilingue)
├── migrations/
│   └── 0001_initial_schema.sql  # Schéma base de données
├── seed.sql                # Données de test
├── ecosystem.config.cjs    # Configuration PM2
├── wrangler.jsonc          # Configuration Cloudflare
└── package.json            # Dépendances et scripts
```

## 📧 Support

Pour toute question ou amélioration, veuillez créer une issue sur le dépôt GitHub.

---

**AideMoi / HelpMe** - Connecter les communautés grâce à des services de confiance 🤝
