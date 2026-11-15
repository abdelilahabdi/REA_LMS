# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





# EduLearn LMS — Frontend React

Interface React connectée à une API Express/MongoDB.

Ce projet couvre l'authentification, les espaces par rôle, la gestion
des apprenants, le catalogue administrateur et les inscriptions
du compte connecté.

## Technologies et contraintes

- React avec Vite, JavaScript/JSX et CSS natif.
- useState uniquement.
- Navigation conditionnelle sur une seule URL.
- Aucun React Router, Context, Redux, Axios ou useEffect.
- Requêtes fetch déclenchées par des événements utilisateur.
- JWT conservé uniquement dans la mémoire de App.

## Installation du frontend

Prérequis : Node.js et npm compatibles avec la version de Vite du projet.

```bash
npm ci
npm run dev -- --port 5173 --strictPort
```

Ouvrir http://localhost:5173.

```bash
npm run build
npm run preview
```

Le backend doit fonctionner séparément sur http://localhost:3000.

## Configuration de l'API

La base URL est actuellement définie dans src/services/api.js :

```javascript
const API_URL = "http://localhost:3000/api";
```

Adapter cette valeur si le backend change d'adresse.

Dans le backend, CORS doit autoriser l'origine exacte du frontend,
par exemple http://localhost:5173. Le middleware CORS doit être
placé avant les routes.

## Démarrage du backend local

Depuis le dépôt backend :

```bash
npm ci
docker compose up -d mongo
npm run dev
```

Docker Desktop doit être démarré.

Configurer le fichier .env local du backend à partir de son exemple :

- PORT : 3000
- MONGO_URI : adresse de la base MongoDB locale sur le port 27018
- JWT_SECRET : secret généré localement
- JWT_EXPIRES_IN : 1h
- SEED_DEMO_PASSWORD : mot de passe local d'au moins 8 caractères

Ne jamais commiter .env, un mot de passe ou un token.

Pour initialiser une base de démonstration dédiée :

```bash
npm run seed
```

Attention : le seed réinitialise les cours de démonstration et leurs
données associées, et met à jour les mots de passe des comptes de démo.
Ne pas le relancer sur une base contenant du travail à conserver.

Comptes de démonstration :

- admin.demo@lms.local
- learner.demo@lms.local
- trainer.demo@lms.local

Le mot de passe est la valeur locale de SEED_DEMO_PASSWORD.

## Fonctionnalités

### Authentification

- Formulaire contrôlé avec validation, chargement et messages d'erreur.
- Connexion réelle, puis récupération du profil.
- Session en mémoire dans App.
- Déconnexion locale et réinitialisation de la navigation.
- Après actualisation de la page, une nouvelle connexion est nécessaire.

### Administration des utilisateurs

- Chargement de la liste réelle.
- Filtres locaux combinés par rôle et statut.
- Sélection et affichage des détails.
- Création et modification des comptes learner.
- Activation et suspension des apprenants.
- Comptes admin et trainer consultables, mais non modifiables
  via ces routes.
- Aucun mot de passe renvoyé dans les listes ou réponses de mutation.

### Administration des cours

- Liste des cours draft, published et archived.
- Filtres locaux combinés par catégorie et statut.
- Création en brouillon avec attribution à un formateur actif.
- Modification des informations.
- Publication, retour en brouillon et archivage avec confirmation.
- Mise à jour de l'interface à partir de la réponse du serveur.

### Espace apprenant

- Chargement des inscriptions du compte connecté.
- Affichage des cours associés.
- États avant chargement, chargement, erreur et liste vide.
- Aucun choix d'identifiant d'un autre apprenant.

## Contrat API utilisé

Toutes les routes protégées reçoivent :

```text
Authorization: Bearer <token>
```

| Méthode | Route | Accès | Réponse de succès |
|---|---|---|---|
| POST | /api/auth/login | Public | data.token et data.user |
| GET | /api/auth/me | Authentifié | data : profil |
| GET | /api/courses | Public | count et data : cours publiés |
| GET | /api/enrollments/me | Authentifié | Tableau direct des inscriptions |
| GET | /api/users | Admin | count et data : utilisateurs |
| POST | /api/users | Admin | 201, data : apprenant créé |
| PUT | /api/users/:id | Admin, cible learner | data : apprenant modifié |
| GET | /api/admin/courses | Admin | count et data : cours |
| POST | /api/admin/courses | Admin | 201, data : cours créé |
| PUT | /api/admin/courses/:id | Admin | data : cours modifié |
| PATCH | /api/admin/courses/:id/status | Admin | data : cours avec son statut |

### Connexion

Corps : email, password.

Le profil complet, notamment name, est récupéré via /api/auth/me.

### Utilisateurs

Création : name, email, password, status.

Modification : name, email, status.

Le serveur impose le rôle learner lors de la création.
Les champs supplémentaires sont refusés.

### Cours administrateur

Création et modification :

- title : chaîne non vide
- description : chaîne non vide
- objectives : tableau facultatif de chaînes non vides
- level : beginner, intermediate ou advanced
- category : chaîne non vide
- estimatedDuration : nombre supérieur ou égal à 1
- trainer : identifiant d'un utilisateur trainer actif

La création impose status = draft.
Le changement de statut utilise un corps séparé :

```json
{
  "status": "archived"
}
```

Valeurs autorisées : draft, published, archived.

Le titre des cours n'est pas unique dans le modèle actuel.

### Erreurs

| Code | Signification | Comportement attendu |
|---|---|---|
| 400 | Données invalides | Message, saisie conservée |
| 401 | Token absent, invalide ou expiré | Retour au login pour les chargements protégés |
| 403 | Accès interdit | Message « Accès refusé », session conservée |
| 404 | Ressource introuvable | Message d'erreur |
| 409 | Conflit, notamment email déjà utilisé | Formulaire conservé |
| Erreur réseau | API inaccessible | Message, aucune fausse confirmation |

Les champs ordinaires des formulaires sont conservés après un refus.
Le mot de passe est effacé après une tentative d'envoi.

## Sécurité

ProtectedView limite le rendu selon le rôle fourni par le serveur.
Les middlewares backend authenticate et authorize protègent les routes.

Masquer un bouton ne constitue pas une preuve de protection backend :
les refus sont également testés avec des requêtes HTTP directes.

La déconnexion efface la session locale. Elle n'invalide pas
le JWT côté serveur.

Le middleware authenticate renforcé vérifie l'existence,
le statut et le rôle actuel du compte en base à chaque requête protégée.
Un compte suspendu reçoit 403, même avec un JWT non expiré.
Après réactivation, ce JWT peut fonctionner jusqu'à son expiration.

## Composants et flux des données

| Composant | Responsabilité et props principales |
|---|---|
| App | Session, vue active, login, logout et expiration |
| LoginForm | Formulaire de connexion ; onLogin |
| AppShell | En-tête ; user, onLogout, children |
| ProtectedView | Protection du rendu ; session, allowedRoles, children |
| AdminLayout | Navigation ; currentView, onNavigate, token, onSessionExpired |
| LearnerLayout | Inscriptions ; token, onSessionExpired |
| UserManagement | Liste, filtres, sélection et mutations ; token, onSessionExpired |
| UserList | Présentation ; users, selectedId, onSelectUser |
| UserForm | Saisie ; initialData, onSubmit, onCancel |
| CourseManagement | Catalogue administrateur et mutations ; token, onSessionExpired |
| CourseForm | Saisie ; initialData, trainers, onSubmit, onCancel |
| CourseCatalog | Ancien catalogue des cours publiés, conservé dans le projet |
| CourseCard / CourseDetails | Présentation et sélection du catalogue publié |

Les données descendent par props.
Les actions remontent par callbacks.
Les listes filtrées et compteurs sont calculés pendant le rendu.
Les mises à jour des listes React utilisent de nouvelles références.

## Vérifications et limites

Voir TESTS.md pour les scénarios et leurs résultats.

- L'espace trainer est hors périmètre de cette interface.
- La gestion des modules, quiz et ressources n'est pas intégrée.
- Les routes Admin ont été ajoutées au backend pour répondre au brief ;
  les anciennes routes Trainer sont conservées.
- Le catalogue public ne constitue pas un endpoint administratif.
- Les captures finales de l'interface ne remplacent pas des maquettes
  de conception si celles-ci sont demandées séparément.

## Captures

Ajouter dans docs/screenshots/ :

- admin-desktop.png
- admin-mobile.png
- learner-mobile.png
- forbidden-403.png

Ne jamais inclure de token ou de mot de passe dans les captures.
