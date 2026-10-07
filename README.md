# 🎫 Mini Support+

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flutter](https://img.shields.io/badge/Flutter-3.24+-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Application moderne de gestion de tickets de support avec API REST sécurisée**

[Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [API Routes](#-routes-api) • [Architecture](#-architecture) • [Démo](#-démo)

</div>

---

## 📋 Vue d'ensemble

**Mini Support+** est une application complète de gestion de tickets de support technique comprenant :

- 🔐 **API REST Node.js** sécurisée par JWT avec Express et MongoDB
- 💻 **Interface web React** moderne et responsive avec TypeScript
- 📱 **Application mobile Flutter** native pour Android/iOS
- 👥 **Système de rôles** : utilisateurs et agents de support
- 🎯 **Gestion intelligente** des priorités et des statuts

---

## ✨ Fonctionnalités

### 🔑 Authentification & Autorisation
- ✅ Inscription et connexion sécurisées avec JWT
- ✅ Deux rôles distincts : **`user`** (utilisateur) et **`agent`** (support)
- ✅ Tokens JWT avec expiration (8 heures)
- ✅ Mots de passe hashés avec bcrypt (cost 12)

### 🎫 Gestion des Tickets

#### Pour les Utilisateurs
- ✅ Création de tickets avec titre, description et priorité
- ✅ Visualisation de ses propres tickets uniquement
- ✅ Statut initial automatique : `OPEN`
- ✅ **Fermeture autonome** de ses propres tickets (`OPEN → CLOSED`)

#### Pour les Agents
- ✅ Vue globale de tous les tickets
- ✅ Tri intelligent : priorité (`URGENT` > `HIGH` > `MEDIUM` > `LOW`) puis ancienneté
- ✅ Attribution atomique des tickets (évite les conflits)
- ✅ Gestion des statuts : `OPEN` → `IN_PROGRESS` → `RESOLVED`

### 🎨 Priorités de Tickets
- 🔴 **URGENT** : Nécessite une attention immédiate
- 🟠 **HIGH** : Priorité élevée
- 🟡 **MEDIUM** : Priorité moyenne
- 🟢 **LOW** : Peut attendre

### 🔄 Workflow des Statuts

```
OPEN → IN_PROGRESS → RESOLVED
  ↓
CLOSED (par l'utilisateur créateur uniquement)
```

---

## 🛠️ Stack Technique

### Backend
- **Node.js 20+** avec Express et TypeScript
- **MongoDB** avec Mongoose ODM
- **JWT** pour l'authentification
- **Zod** pour la validation des données
- **bcrypt** pour le hashage des mots de passe

### Frontend Web
- **React 18** avec TypeScript
- **Vite** pour le build rapide
- **Axios** pour les requêtes HTTP
- **React Router** pour la navigation
- **Context API** pour la gestion d'état

### Mobile
- **Flutter 3.24+** avec Dart
- **Provider** pour la gestion d'état
- **SharedPreferences** pour la persistance
- **Material Design 3**

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ✅ **Node.js** 20 ou supérieur ([Télécharger](https://nodejs.org/))
- ✅ **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- ✅ **Flutter SDK** (pour l'app mobile - optionnel) ([Installer](https://flutter.dev/))
- ✅ **Git** ([Télécharger](https://git-scm.com/))

---

## 🚀 Installation

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/votre-username/mini-support.git
cd mini-support
```

### 2️⃣ Backend - API Node.js

#### Configuration

```powershell
cd backend
Copy-Item .env.example .env
```

Éditez le fichier `.env` et configurez :

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/mini-support
JWT_SECRET=votre-secret-jwt-ultra-securise-ici
CLIENT_URL=http://localhost:5173
```

> 💡 **Astuce** : Pour MongoDB Atlas, utilisez une URI du type :
> ```
> mongodb+srv://user:password@cluster.mongodb.net/mini-support
> ```

#### Installation et démarrage

```powershell
npm install
npm run dev
```

✅ **L'API tourne sur** : http://localhost:4000

#### Créer un agent de démonstration

```powershell
npm run seed:agent
```

**Identifiants de test** :
- 📧 Email : `agent@minisupport.local`
- 🔑 Mot de passe : `Agent123!`

> ⚠️ **Note** : Ce script est uniquement pour le développement. En production, utilisez une interface d'administration sécurisée.

---

### 3️⃣ Frontend Web - React

#### Configuration

```powershell
cd frontend
Copy-Item .env.example .env
```

Le fichier `.env` devrait contenir :

```env
VITE_API_URL=http://localhost:4000/api
```

#### Installation et démarrage

```powershell
npm install
npm run dev
```

✅ **L'interface web est disponible sur** : http://localhost:5173

---

### 4️⃣ Mobile - Flutter (Optionnel)

Consultez le [README mobile](./mobile/README.md) pour les instructions détaillées.

#### Démarrage rapide

```bash
cd mobile
flutter pub get
flutter run
```

> 📱 **Important** : L'émulateur Android utilise `http://10.0.2.2:4000/api` pour accéder au backend local.

---

## 🌐 Routes API

### Documentation complète

Toutes les routes protégées nécessitent l'en-tête :
```
Authorization: Bearer <votre_token_jwt>
```

### 🔓 Routes publiques

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur (`user`) |
| `POST` | `/api/auth/login` | Connexion et obtention du JWT |

### 🔐 Routes protégées - Authentification

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/auth/me` | Tous | Informations de l'utilisateur connecté |

### 🎫 Routes protégées - Tickets

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| `POST` | `/api/tickets` | `user` | Créer un nouveau ticket |
| `GET` | `/api/tickets` | Tous | Liste des tickets (filtrée selon le rôle) |
| `GET` | `/api/tickets/:id` | Créateur ou `agent` | Détails d'un ticket spécifique |
| `PATCH` | `/api/tickets/:id/assign` | `agent` | S'attribuer un ticket non assigné |
| `PATCH` | `/api/tickets/:id/status` | `agent` | Modifier le statut d'un ticket |
| `PATCH` | `/api/tickets/:id/close` | `user` | Fermer son propre ticket (`OPEN` → `CLOSED`) |

---

## 📝 Exemples d'utilisation

### Inscription d'un utilisateur

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse** :
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Création d'un ticket

```bash
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Impossible de me connecter",
  "description": "La page reste bloquée après la saisie de mon mot de passe.",
  "priority": "HIGH"
}
```

**Réponse** :
```json
{
  "ticket": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Impossible de me connecter",
    "description": "La page reste bloquée après la saisie de mon mot de passe.",
    "priority": "HIGH",
    "status": "OPEN",
    "creator": { "_id": "...", "name": "Jean Dupont", "email": "...", "role": "user" },
    "assignedAgent": null,
    "createdAt": "2026-10-07T10:30:00.000Z",
    "updatedAt": "2026-10-07T10:30:00.000Z"
  }
}
```

### Modifier le statut d'un ticket (Agent)

```bash
PATCH /api/tickets/507f1f77bcf86cd799439012/status
Authorization: Bearer <agent_token>
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

### Fermer un ticket (Utilisateur)

```bash
PATCH /api/tickets/507f1f77bcf86cd799439012/close
Authorization: Bearer <user_token>
```

> ✅ **Conditions** : Le ticket doit être au statut `OPEN` et appartenir à l'utilisateur connecté.

---

## 🏗️ Architecture

### Backend - Structure en couches

```
backend/
├── src/
│   ├── config/         # Configuration (DB, environnement)
│   ├── models/         # Schémas Mongoose (User, Ticket)
│   ├── schemas/        # Validation Zod
│   ├── middleware/     # Auth, validation, gestion d'erreurs
│   ├── services/       # Logique métier
│   ├── controllers/    # Gestion HTTP et réponses
│   ├── routes/         # Définition des endpoints
│   ├── types/          # Types TypeScript
│   ├── scripts/        # Scripts utilitaires (seed)
│   ├── app.ts          # Configuration Express
│   └── server.ts       # Point d'entrée
```

**Principes** :
- ✅ Séparation claire des responsabilités
- ✅ Controllers légers, services épais
- ✅ Validation à deux niveaux (Zod + Mongoose)
- ✅ Middleware réutilisables et composables

### Frontend - Architecture React

```
frontend/
├── src/
│   ├── api/            # Client Axios avec intercepteurs
│   ├── context/        # Context API (AuthContext)
│   ├── pages/          # Pages (Auth, Dashboard)
│   ├── components/     # Composants réutilisables
│   ├── types/          # Types TypeScript partagés
│   ├── App.tsx         # Configuration des routes
│   └── main.tsx        # Point d'entrée
```

### Mobile - Architecture Flutter

```
mobile/
├── lib/
│   ├── models/         # Classes de données (Ticket, User)
│   ├── services/       # Services API (Auth, Tickets)
│   ├── state/          # Gestion d'état (Provider)
│   ├── screens/        # Écrans (Auth, Dashboard)
│   ├── widgets/        # Widgets réutilisables
│   ├── config.dart     # Configuration API
│   └── main.dart       # Point d'entrée
```

---

## 🔒 Choix Sécurité

### Authentification & Autorisation
- ✅ **JWT** avec expiration configurée (8 heures par défaut)
- ✅ **Bcrypt** avec cost factor 12 pour le hashage des mots de passe
- ✅ **Middleware d'autorisation** basé sur les rôles
- ✅ **Inscription publique** limitée au rôle `user` uniquement
- ✅ **Validation stricte** des entrées avec Zod
- ✅ **Protection CORS** configurée

### Règles Métier Sécurisées
- ✅ **Vérification de propriété** : un utilisateur ne peut fermer que ses propres tickets
- ✅ **Transitions de statut contrôlées** : workflow strict
- ✅ **Attribution atomique** : évite les race conditions avec `findOneAndUpdate`
- ✅ **Mots de passe jamais exposés** dans les réponses API

### Validation
- ✅ **Double validation** : Zod (routes) + Mongoose (base de données)
- ✅ **Limite de taille** des requêtes (100kb)
- ✅ **Types stricts** avec TypeScript

---

## ⚡ Optimisations Performance

### Base de Données
- ✅ **Index MongoDB optimisés** :
  ```javascript
  { creator: 1, createdAt: -1 }           // Recherche utilisateur
  { priorityWeight: -1, createdAt: 1 }    // Tri agent
  { assignedAgent: 1 }                    // Tickets assignés
  ```
- ✅ **`priorityWeight`** : champ précalculé pour éviter les tris coûteux
- ✅ **Requêtes atomiques** : `findOneAndUpdate` pour l'attribution
- ✅ **Populate intelligent** : sélection des champs nécessaires uniquement

### Backend
- ✅ **Architecture stateless** : scalabilité horizontale facilitée
- ✅ **Mongoose lean queries** pour les lectures
- ✅ **Gestion d'erreurs centralisée** : pas de try/catch répétés

### Frontend
- ✅ **Code splitting** avec Vite
- ✅ **Context API** : évite les re-renders inutiles
- ✅ **Bundle optimization** : production optimisée

---

## 🚀 Améliorations pour la Production

### 🔐 Sécurité

#### Court terme
- [ ] **Cookies `httpOnly`** au lieu de `localStorage` pour stocker les JWT
- [ ] **Refresh tokens** avec rotation et révocation
- [ ] **Rate limiting** (express-rate-limit) par IP et par utilisateur
- [ ] **Helmet.js** pour les headers de sécurité HTTP
- [ ] **CSRF protection** avec tokens
- [ ] **Input sanitization** (express-validator)
- [ ] **Gestion centralisée des secrets** (Vault, AWS Secrets Manager)

#### Moyen terme
- [ ] **Authentification multi-facteur (2FA)** pour les agents
- [ ] **Audit logging** complet des actions sensibles
- [ ] **IP whitelisting** pour les agents
- [ ] **Session management** avancé avec révocation
- [ ] **Chiffrement des données sensibles** au repos

### ⚡ Performances

#### Court terme
- [ ] **Pagination par curseur** au lieu d'offset
- [ ] **Redis cache** pour les lectures fréquentes (liste tickets agents)
- [ ] **CDN** pour les assets statiques (frontend)
- [ ] **Compression gzip/brotli** des réponses
- [ ] **Index composites** adaptés aux requêtes réelles

#### Moyen terme
- [ ] **GraphQL** ou **REST optimisé** avec field selection
- [ ] **WebSockets** pour les notifications temps réel
- [ ] **Service Worker** pour le mode offline (PWA)
- [ ] **Lazy loading** des images et composants
- [ ] **Database connection pooling** optimisé

### 📈 Montée en Charge

#### Architecture distribuée
- [ ] **Load balancer** (Nginx, HAProxy) devant plusieurs instances Node.js
- [ ] **Séparation lecture/écriture** : réplicas MongoDB pour les lectures
- [ ] **Queue système** (Redis, RabbitMQ) pour les tâches asynchrones
- [ ] **Auto-scaling** avec Kubernetes ou AWS ECS
- [ ] **CDN global** (CloudFlare, AWS CloudFront)

#### Observabilité
- [ ] **Métriques** : Prometheus + Grafana
- [ ] **Tracing distribué** : Jaeger, OpenTelemetry
- [ ] **Logging centralisé** : ELK Stack (Elasticsearch, Logstash, Kibana)
- [ ] **APM** : New Relic, Datadog
- [ ] **Alerting** automatique sur les anomalies

#### Base de données
- [ ] **Sharding MongoDB** par tenant ou date
- [ ] **Read replicas** pour distribuer la charge de lecture
- [ ] **Archivage automatique** des vieux tickets
- [ ] **Backup automatisé** avec point-in-time recovery

### 🎯 Fonctionnalités supplémentaires

- [ ] **Commentaires** sur les tickets (conversation agent-user)
- [ ] **Pièces jointes** (images, documents)
- [ ] **Notifications** (email, push mobile)
- [ ] **Dashboard analytics** (métriques, KPIs)
- [ ] **Interface admin** pour gérer les agents
- [ ] **Recherche full-text** avec Elasticsearch
- [ ] **Export** des tickets (CSV, PDF)
- [ ] **Templates** de réponses pour agents
- [ ] **SLA tracking** (délais de réponse)
- [ ] **Satisfaction client** (rating après résolution)

---

## 🧪 Tests et Vérification

### Build de production

```powershell
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Tests (à implémenter)

```powershell
# Backend - Tests unitaires et d'intégration
cd backend
npm test

# Frontend - Tests composants
cd frontend
npm test

# Mobile - Tests Flutter
cd mobile
flutter test
```




## 📊 Diagrammes

### Architecture Globale

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Web App   │         │ Mobile App  │         │   Postman   │
│   (React)   │         │  (Flutter)  │         │   (Tests)   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       └───────────────────────┴───────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    API REST Node.js │
                    │   (Express + JWT)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      MongoDB        │
                    │  (Users + Tickets)  │
                    └─────────────────────┘
```

### Workflow d'un Ticket

```
USER                    AGENT                   SYSTÈME
  │                       │                       │
  ├─ Crée ticket ────────►│                       │
  │                       │◄──── Status: OPEN ────┤
  │                       │                       │
  │                       ├─ S'attribue ─────────►│
  │◄──────────────────────┤                       │
  │   Notification        │◄── assignedAgent ─────┤
  │                       │                       │
  │                       ├─ Traite ─────────────►│
  │◄──────────────────────┤                       │
  │   IN_PROGRESS         │◄── Status update ─────┤
  │                       │                       │
  │                       ├─ Résout ─────────────►│
  │◄──────────────────────┤                       │
  │   RESOLVED            │◄── Status: RESOLVED ──┤
  │                       │                       │
  ├─ OU Ferme ───────────────────────────────────►│
  │◄── Status: CLOSED ────────────────────────────┤
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une **branche** pour votre feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add: Amazing feature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de code

- ✅ **ESLint** configuré pour TypeScript
- ✅ **Prettier** pour le formatage
- ✅ Commits suivant [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ Tests pour les nouvelles fonctionnalités

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

