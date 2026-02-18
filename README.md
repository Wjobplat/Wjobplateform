# 🎯 JobFlow - Plateforme de Gestion de Candidatures

Une plateforme web moderne et élégante pour automatiser et gérer votre recherche d'emploi avec un contrôle humain total.

![Dashboard](https://img.shields.io/badge/Status-Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Fonctionnalités

### 📊 Dashboard Centralisé
- Vue d'ensemble avec KPIs en temps réel
- Timeline d'activité récente
- Statistiques de candidatures
- Design moderne avec glassmorphism et animations

### 🔍 Recherche d'Emplois
- Filtres avancés (localisation, type de contrat, compétences, compatibilité)
- Score de compatibilité pour chaque offre
- Vue détaillée des offres avec modal
- Tri par compatibilité, date ou entreprise
- Mock data de 8+ offres d'emploi

### 📝 Gestion des Candidatures
- Suivi par statut (Brouillon, En attente, Envoyée, Réponse)
- Historique complet des candidatures
- Notes personnelles pour chaque candidature
- Actions contextuelles selon le statut

### ✅ Workflow de Validation (Human-in-the-Loop)
- **Aucune candidature envoyée sans validation explicite**
- Prévisualisation complète de l'email et lettre de motivation
- Édition en temps réel avant envoi
- Génération automatique de contenu personnalisé
- Confirmation obligatoire avant envoi

### 👥 Gestion des Recruteurs
- Base de données de contacts recruteurs
- Informations de contact (email, LinkedIn)
- Lien vers les offres de l'entreprise

## 🚀 Installation et Utilisation

### Prérequis
Aucun ! Cette application fonctionne directement dans le navigateur sans installation.

### Lancement

1. **Ouvrir le fichier principal**
   ```
   Ouvrez simplement le fichier index.html dans votre navigateur
   ```

2. **Navigation**
   - **Dashboard** : Vue d'ensemble et statistiques
   - **Recherche d'emplois** : Parcourir et filtrer les offres
   - **Candidatures** : Gérer vos candidatures
   - **Recruteurs** : Consulter vos contacts

3. **Workflow complet**
   ```
   Rechercher une offre → Préparer candidature → Réviser et modifier → Approuver → Envoyer
   ```

## 📁 Structure du Projet

```
job-platform/
├── index.html              # Dashboard principal
├── jobs.html               # Page de recherche d'emplois
├── applications.html       # Gestion des candidatures
├── application-review.html # Révision et validation
├── recruiters.html         # Gestion des recruteurs
├── styles.css              # Design system complet
├── tabs.css                # Styles pour les onglets
├── data.js                 # Mock data (jobs, recruteurs, candidatures)
├── dashboard.js            # Logique du dashboard
├── jobs.js                 # Logique de recherche
├── applications.js         # Logique des candidatures
├── application-review.js   # Logique de validation
└── recruiters.js           # Logique des recruteurs
```

## 🎨 Design

### Thème
- **Mode sombre** avec palette de couleurs vibrantes
- **Glassmorphism** pour un effet moderne
- **Gradients** personnalisés (violet/bleu)
- **Animations fluides** pour une UX premium

### Palette de Couleurs
- Primary: `#667eea` → `#764ba2`
- Success: `#4facfe` → `#00f2fe`
- Warning: `#fbbf24`
- Danger: `#f5576c`

## 🔒 Sécurité et Contrôle

### Principe Human-in-the-Loop
Cette plateforme implémente un **contrôle humain total** :

1. ✅ **Aucune action automatique** sans validation
2. ✅ **Prévisualisation obligatoire** de tous les contenus
3. ✅ **Édition possible** à chaque étape
4. ✅ **Confirmation explicite** requise pour l'envoi
5. ✅ **Traçabilité complète** de toutes les actions

## 📊 Données

### Mock Data Inclus
- **8 offres d'emploi** variées (Full Stack, Data, DevOps, etc.)
- **3 recruteurs** avec informations de contact
- **5 candidatures** à différents stades
- **Timeline d'activité** récente

### Personnalisation
Pour ajouter vos propres données, modifiez le fichier `data.js` :
- `mockData.jobs` : Vos offres d'emploi
- `mockData.recruiters` : Vos contacts
- `mockData.applications` : Vos candidatures

## 🔮 Évolutions Futures

### Intégrations Réelles
- [ ] API LinkedIn Jobs
- [ ] API Indeed
- [ ] API Welcome to the Jungle
- [ ] Scraping de sites carrières

### Backend
- [ ] Base de données persistante (PostgreSQL)
- [ ] API REST avec Node.js/Express
- [ ] Authentification utilisateur
- [ ] Envoi d'emails réel (SMTP/SendGrid)

### Fonctionnalités Avancées
- [ ] IA pour génération de lettres de motivation
- [ ] Analyse de compatibilité avancée
- [ ] Rappels automatiques
- [ ] Export de données (PDF, CSV)
- [ ] Statistiques avancées et graphiques

## 🛠️ Technologies

- **HTML5** - Structure
- **CSS3** - Design system moderne
- **JavaScript (Vanilla)** - Logique applicative
- **Google Fonts (Inter)** - Typographie

## 📝 Licence

Ce projet est un prototype de démonstration.

## 👨‍💻 Auteur

Créé avec ❤️ pour automatiser la recherche d'emploi tout en gardant le contrôle.

---

**Note** : Cette application utilise actuellement des données de démonstration. Pour une utilisation en production, il faudra implémenter les intégrations API réelles et un backend sécurisé.
