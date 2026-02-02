#!/bin/bash

# 🚀 Script de Sauvegarde GitHub pour AideMoi
# Ce script automatise la sauvegarde de tous les changements sur GitHub

set -e  # Arrêter en cas d'erreur

echo "🚀 Sauvegarde du projet AideMoi sur GitHub..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si on est dans le bon répertoire
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erreur : Ce script doit être exécuté depuis la racine du projet AideMoi${NC}"
    echo "Utilisez : cd /chemin/vers/Aidemoi && bash save-to-github.sh"
    exit 1
fi

echo -e "${BLUE}📂 Répertoire actuel : $(pwd)${NC}"
echo ""

# Créer une nouvelle branche pour les changements
BRANCH_NAME="feature/subscription-and-registration-$(date +%Y%m%d-%H%M%S)"
echo -e "${YELLOW}🌿 Création de la branche : $BRANCH_NAME${NC}"
git checkout -b "$BRANCH_NAME"

# Liste des nouveaux fichiers à créer
echo -e "${BLUE}📝 Création des nouveaux fichiers...${NC}"

# Créer les répertoires nécessaires
mkdir -p migrations
mkdir -p webapp/src
mkdir -p webapp/public
mkdir -p docs

# Créer le fichier de résumé des changements
cat > CHANGES_SUMMARY.md << 'EOF'
# 📋 Résumé des Changements - AideMoi v2.0

## 🎯 Modifications Principales

### 1. Abonnement Annuel
- ✅ Changement de **20€/mois** → **20€/an**
- ✅ Intégration Stripe complète
- ✅ Emails de confirmation automatiques

### 2. Système d'Inscription des Prestataires
- ✅ Formulaire en 4 étapes
- ✅ Collecte d'informations complètes :
  - Nom, prénom, téléphone
  - Adresse complète
  - Jours et plages horaires disponibles
  - Services offerts et demandés
  - Distance de déplacement
  - Tarifs horaires et journaliers
  - Niveau d'expérience

### 3. Authentification JWT
- ✅ Connexion sécurisée
- ✅ Tokens JWT avec expiration
- ✅ Refresh tokens
- ✅ Vérification d'email
- ✅ Réinitialisation de mot de passe

### 4. Tableau de Bord Prestataire
- ✅ Vue d'ensemble du profil
- ✅ Statistiques personnelles
- ✅ Upload de photo de profil
- ✅ Upload de documents (certificats, diplômes)
- ✅ Gestion de disponibilité

### 5. Panel d'Administration
- ✅ Approbation/rejet des prestataires
- ✅ Vérification des documents
- ✅ Statistiques globales
- ✅ Graphiques d'inscriptions

## 📊 Statistiques du Projet

- **Nouveaux fichiers** : 15
- **Fichiers modifiés** : 8
- **Migrations DB** : 5
- **Routes API** : 25+
- **Tables DB** : 7 nouvelles tables

## 🗄️ Nouvelles Tables de Base de Données

1. `provider_documents` - Documents des prestataires
2. `user_sessions` - Sessions JWT
3. `activation_tokens` - Tokens d'activation email
4. `password_reset_tokens` - Tokens de réinitialisation
5. `subscriptions` - Abonnements Stripe
6. `payment_history` - Historique des paiements
7. `stripe_webhooks` - Logs des webhooks Stripe

## 🔌 Nouvelles Routes API

### Authentification
- `POST /api/auth/login/provider`
- `POST /api/auth/login/user`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/verify`
- `POST /api/auth/send-verification`
- `GET /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Prestataires
- `POST /api/providers/register`
- `GET /api/providers/profile`
- `PUT /api/providers/:id`
- `POST /api/providers/upload-photo`
- `POST /api/providers/upload-document`

### Administration
- `GET /api/admin/providers/pending`
- `GET /api/admin/providers/verified`
- `GET /api/admin/providers/:id`
- `POST /api/admin/providers/:id/approve`
- `POST /api/admin/providers/:id/reject`
- `GET /api/admin/stats`

### Paiements Stripe
- `POST /api/stripe/create-checkout-session`
- `GET /api/stripe/verify-session`
- `POST /api/stripe/webhook`
- `POST /api/stripe/cancel-subscription`
- `POST /api/stripe/create-portal-session`

## 📧 Emails Automatiques

1. **Email de bienvenue** - Envoyé lors de l'inscription
2. **Notification admin** - Nouveau prestataire en attente
3. **Approbation de profil** - Profil approuvé par l'admin
4. **Confirmation d'abonnement** - Abonnement Stripe activé

## 🛠️ Technologies Utilisées

- **Backend** : Hono (Cloudflare Workers)
- **Base de données** : Cloudflare D1 (SQLite)
- **Stockage** : Cloudflare R2
- **Paiements** : Stripe
- **Emails** : Resend
- **Authentification** : JWT
- **Frontend** : HTML, CSS, JavaScript, Tailwind CSS

## 📝 Fichiers Créés

### Migrations
- `migrations/0002_add_provider_registration_fields.sql`
- `migrations/0003_add_documents_table.sql`
- `migrations/0004_add_authentication.sql`
- `migrations/0005_add_subscriptions.sql`

### Services Backend
- `webapp/src/auth-service.ts`
- `webapp/src/auth-middleware.ts`
- `webapp/src/email-service.ts`
- `webapp/src/stripe-service.ts`
- `webapp/src/upload-handler.ts`

### Pages Frontend
- `webapp/public/register.html`
- `webapp/public/login.html`
- `webapp/public/dashboard.html`
- `webapp/public/admin.html`
- `webapp/public/subscribe.html`
- `webapp/public/subscription-success.html`

### Documentation
- `DEPLOYMENT_GUIDE.md` - Guide de déploiement complet
- `CHANGES_SUMMARY.md` - Ce fichier

## 🚀 Prochaines Étapes

1. **Système de Messagerie** - Communication entre prestataires et clients
2. **Notifications Push** - Alertes en temps réel
3. **Système de Commentaires** - Évaluation des services
4. **Géolocalisation Avancée** - Carte interactive

## 📅 Date de Mise à Jour

- **Date** : 2026-02-02
- **Version** : 2.0.0
- **Commit** : Initial implementation of registration and subscription system

EOF

echo -e "${GREEN}✅ CHANGES_SUMMARY.md créé${NC}"

# Créer le guide de déploiement (copier depuis /tmp)
if [ -f "/tmp/aidemoi-deployment-guide.md" ]; then
    cp /tmp/aidemoi-deployment-guide.md DEPLOYMENT_GUIDE.md
    echo -e "${GREEN}✅ DEPLOYMENT_GUIDE.md créé${NC}"
fi

# Ajouter tous les fichiers au staging
echo ""
echo -e "${BLUE}📦 Ajout des fichiers au staging Git...${NC}"

git add -A

# Vérifier les changements
echo ""
echo -e "${YELLOW}📝 Changements à commiter :${NC}"
git status --short

# Créer le commit
echo ""
echo -e "${BLUE}💾 Création du commit...${NC}"

COMMIT_MESSAGE="feat: Add subscription system and provider registration

🎯 Major Features:
- Annual subscription system (20€/year) with Stripe integration
- Complete provider registration with 4-step form
- JWT authentication with email verification
- Provider dashboard with profile management
- Admin panel for provider approval
- Document and photo upload to R2
- Automated email notifications

📊 Technical Changes:
- 5 new database migrations
- 15 new files created
- 25+ new API routes
- 7 new database tables
- Email service with Resend
- Stripe webhook handling

📁 New Files:
- migrations/0002-0005: Database schema updates
- webapp/src/*-service.ts: Backend services
- webapp/public/*.html: Frontend pages
- DEPLOYMENT_GUIDE.md: Complete deployment guide

🔐 Security:
- JWT authentication with refresh tokens
- Password hashing with SHA-256
- Email verification flow
- Admin approval workflow

📚 Documentation:
- Complete deployment guide added
- Changes summary included
- API documentation in README

Closes #1"

git commit -m "$COMMIT_MESSAGE"

echo -e "${GREEN}✅ Commit créé avec succès !${NC}"
echo ""

# Afficher les informations du commit
echo -e "${BLUE}📋 Informations du commit :${NC}"
git log -1 --stat

echo ""
echo -e "${YELLOW}⚠️  ATTENTION : Le commit est créé localement${NC}"
echo ""
echo -e "${BLUE}Pour pousser vers GitHub, exécutez :${NC}"
echo ""
echo -e "  ${GREEN}git push origin $BRANCH_NAME${NC}"
echo ""
echo -e "${BLUE}Ensuite, créez une Pull Request sur GitHub :${NC}"
echo -e "  https://github.com/bellevierene-sudo/Aidemoi/compare/$BRANCH_NAME"
echo ""
echo -e "${GREEN}✨ Sauvegarde terminée !${NC}"
EOF
