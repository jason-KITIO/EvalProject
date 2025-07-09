# EvalProject - Plateforme d'Évaluation de Projets Universitaires

Une application web moderne et responsive pour l'évaluation anonyme des projets lors des soutenances universitaires.

## 🎯 Fonctionnalités Principales

### Pour les Évaluateurs

- **Évaluation anonyme** sans inscription requise
- **Critères multiples** (présentation, technique, innovation, global)
- **Système anti-vote multiple** avec empreinte digitale
- **Modification des votes** possible
- **Commentaires publics** sur chaque projet
- **Interface responsive** (mobile, tablette, desktop)
- **Recherche et filtrage** par filière
- **Vues grille et liste** avec pagination

### Pour les Administrateurs

- **Dashboard complet** avec statistiques en temps réel
- **Gestion des projets** (CRUD complet)
- **Import Excel** avec drag & drop
- **Export CSV/Excel** des résultats
- **Système d'authentification** sécurisé
- **Synchronisation automatique** toutes les 3 minutes

## 🚀 Technologies Utilisées

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Import/Export**: xlsx, CSV
- **Icons**: Lucide React

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/evalproject.git
   cd evalproject
   ```

2. **Installer les dépendances**
   ```bash
   npm install 
   ```
   ou
   ```bash
   pnpm install 
   ```

3. **Configuration Supabase**

   - Créer un nouveau projet sur [Supabase](https://supabase.com)
   - Copier l'URL et la clé anonyme
   - Exécuter le script SQL pour créer les tables

4. **Variables d'environnement**
   Créer un fichier `.env.local ` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 🗄️ Structure de la Base de Données

### Table `projects`

- `id`: UUID (clé primaire)
- `title`: VARCHAR(255) - Titre du projet
- `description`: TEXT - Description
- `field`: VARCHAR(100) - Filière
- `members`: TEXT[] - Membres de l'équipe
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Table `ratings`

- `id`: UUID (clé primaire)
- `project_id`: UUID (référence vers projects)
- `user_session`: VARCHAR(255) - Identifiant utilisateur
- `presentation`: INTEGER (1-5)
- `technical`: INTEGER (1-5)
- `innovation`: INTEGER (1-5)
- `overall`: INTEGER (1-5)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Table `comments`

- `id`: UUID (clé primaire)
- `project_id`: UUID (référence vers projects)
- `user_session`: VARCHAR(255) - Identifiant utilisateur
- `content`: TEXT - Contenu du commentaire
- `created_at`: TIMESTAMP

## 🎨 Design System

### Palette de Couleurs

- **Vert foncé**: #004838 (couleur principale)
- **Vert moyen**: #073127 (hover states)
- **Vert clair**: #E2FB6C (accents)
- **Gris**: #333F3C, #EBEDE8 (textes et arrière-plans)

### Typographie

- **Police**: Inter (Google Fonts)
- **Tailles**: 12px à 60px selon les contextes

## 📱 Utilisation

### Pour les Évaluateurs

1. **Accéder à la plateforme**

   - Aller sur la page d'accueil
   - Cliquer sur "Commencer l'évaluation"

2. **Évaluer un projet**

   - Parcourir la liste des projets
   - Utiliser les filtres par filière
   - Cliquer sur "Évaluer ce projet"
   - Noter selon les 4 critères
   - Ajouter un commentaire (optionnel)
   - Valider l'évaluation

3. **Modifier un vote**
   - Les projets déjà évalués affichent "Modifier mon vote"
   - Cliquer pour mettre à jour l'évaluation

### Pour les Administrateurs

1. **Connexion**

   - Aller sur `/admin/login`
   - Se connecter avec ses identifiants
   - Ou créer un compte sur `/admin/register`

2. **Gestion des projets**

   - Ajouter manuellement des projets
   - Importer depuis Excel (`/admin/import`)
   - Modifier ou supprimer des projets

3. **Consultation des résultats**
   - Voir les statistiques en temps réel
   - Consulter les classements
   - Exporter les données

## 📊 Import Excel

### Format attendu

Le fichier Excel doit contenir 3 colonnes :

1. **Titre du projet** (obligatoire)
2. **Description** (optionnel)
3. **Membres** (séparés par des points-virgules)

### Exemple

```
Titre du projet | Description | Membres
Système de Gestion | Application web | Alice Martin;Bob Dupont
Robot Autonome | Robot avec IA | David Moreau;Emma Leroy
```

### Authentification Admin

- **Supabase Auth** avec email/mot de passe
- **Sessions sécurisées** avec tokens JWT
- **Vérification automatique** de l'authentification

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes

- Netlify
- Railway
- Heroku

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🎯 Roadmap

- [ ] Graphiques avancés dans les résultats
- [ ] Notifications en temps réel
- [ ] API REST publique
- [ ] Application mobile
- [ ] Intégration avec d'autres LMS
- [ ] Système de templates personnalisables

---

**EvalProject** - Simplifiez l'évaluation de vos projets universitaires 🎓
