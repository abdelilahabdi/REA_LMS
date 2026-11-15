# Plan de tests manuels

Environnement : React/Vite, API Express locale, MongoDB Docker.

« Validé » correspond aux scénarios déjà exécutés et confirmés.
Les autres scénarios doivent être exécutés avant livraison.

| Scénario | Résultat attendu | État |
|---|---|---|
| Login Admin | Espace Admin et profil serveur | Validé |
| Login Learner | Espace Learner sans menu Admin | Validé |
| Login Trainer | Message indiquant l'absence de cet espace | Validé |
| Mauvais mot de passe | 401, aucune session créée | À vérifier |
| Déconnexion | Retour au login | Validé |
| Token expiré | 401, retour au login avec message | Validé |
| Utilisateurs : chargement et filtres | Liste réelle, filtrage local | Validé |
| Création d'un learner | Compte persisté et visible | Validé |
| Modification d'un learner | Modification conservée après rechargement | Validé |
| Email déjà utilisé | 409, formulaire conservé | Validé |
| Learner : GET /api/users | 403 sans données administratives | Validé |
| Sans token : GET /api/users | 401 | À vérifier |
| Learner : GET /api/admin/courses | 403 | À vérifier |
| Learner : mutations Admin utilisateurs et cours | 403, aucune modification | À vérifier |
| Catalogue Admin : chargement et filtres | Toutes les publications, filtres combinés | Validé |
| Création d'un cours | 201, statut draft | Validé |
| Modification d'un cours | Modification persistée | Validé |
| Publication d'un cours | Statut published confirmé | Validé |
| Annulation de l'archivage | Aucun changement | Validé |
| Confirmation de l'archivage | Statut archived confirmé | Validé |
| Formulaire cours vide | Erreurs, aucune création | Validé |
| Erreur réseau pendant la sauvegarde d'un cours | Saisie conservée, aucun faux succès | À vérifier |
| Payload invalide envoyé directement à l'API | 400 | À vérifier |
| ID valide mais inexistant | 404 | À vérifier |
| Mes cours : compte inscrit | Inscription réelle affichée | Validé |
| Mes cours : nouveau learner sans inscription | Message de liste vide | À vérifier |
| Login d'un compte suspendu | 403, aucune session créée | À vérifier |
| Suspension après login, puis requête avec ancien JWT | 403, session conservée, données effacées de la vue | À vérifier |
| Réactivation avec JWT encore valide | Chargement à nouveau autorisé | À vérifier |
| Affichage à 375 px | Aucun débordement horizontal | À vérifier |
| Navigation clavier | Focus visible et contrôles accessibles | À vérifier |
| AppShell après extraction | Login, espaces et logout fonctionnent | À vérifier |
| npm run build après les derniers changements | Compilation réussie | À vérifier |

## Preuves

Ajouter les captures dans docs/screenshots/.
Pour le refus 403, montrer la méthode, l'URL et le statut,
sans afficher le token ni les identifiants secrets.

Pour chaque échec, noter :
- action effectuée ;
- résultat observé ;
- correction ;
- résultat du nouveau test.