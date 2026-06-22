# Rendu TP1 - Réparer une image Docker cassée

**Étudiant :** Robin Gonçalves
**Module :** DevOps - Bachelor 2 Développement

---

## Niveau 1 : Analyse et diagnostic du Dockerfile

En lisant le Dockerfile fourni, j'ai repéré plusieurs problèmes qui empêchent de l'utiliser proprement en production. Voici mon analyse détaillée pour chacun d'eux :

| Ligne(s) | Problème observé | Conséquence en production | Correction envisagée |
| :--- | :--- | :--- | :--- |
| **6 à 8** | Les mots de passe et clés API (`API_KEY`, etc.) sont écrits "en dur" dans le fichier. | N'importe qui ayant accès à l'image peut lire ces secrets en clair. C'est une grosse faille de sécurité. | Retirer ces lignes. Il faut passer ces variables au moment du lancement du conteneur (avec un `.env` ou `docker run -e`). |
| **1** | L'image de base `node:18` est beaucoup trop grosse (basée sur une distribution Debian complète). | L'image finale va peser près d'un Go. C'est très long à télécharger et ça prend beaucoup d'espace pour rien. | Remplacer par une version allégée, comme `node:18-alpine`. |
| **11 et 15** | Le code entier est copié (`COPY . .`) *avant* de lancer le `npm install`. | À chaque fois qu'on modifiera un fichier de code (comme index.js), le cache sera cassé et il faudra retélécharger toutes les dépendances. C'est super long ! | Copier juste le `package.json` d'abord, faire le `npm install`, puis seulement après copier le reste du code. |
| **19 à 25** | Installation de plein de paquets inutiles (`curl`, `vim`, `htop`, etc.). | Ça alourdit l'image et surtout ça laisse plein d'outils à la disposition d'un éventuel pirate s'il arrive à s'introduire dans le conteneur. | Enlever le `RUN apt-get update...` complètement. On n'en a pas besoin pour faire tourner l'app. |
| **29** | Il n'y a pas d'instruction `USER` donc l'application tourne en tant que `root`. | Si le code de l'appli se fait pirater, le hacker aura directement les droits administrateurs à l'intérieur du conteneur. | Rajouter `USER node` pour utiliser l'utilisateur non-privilégié natif inclus dans l'image Node. |

---

## Niveau 2 : Réparation

Pour corriger ces problèmes (sans toucher au code Javascript ni au `package.json` comme demandé), j'ai créé un `.dockerignore` et j'ai totalement réécrit le `Dockerfile` (disponibles à la racine du dossier tp1). J'ai également fait attention aux droits d'écriture sur le dossier `/app/data` lors de la construction de l'image.

### Vérification des critères du sujet

J'ai fait attention à bien valider tous les points attendus :
- [x] L'image finale fait moins de 200 MB (elle tourne autour de 170 MB grâce à la version alpine).
- [x] Il n'y a plus aucun secret écrit dans l'image.
- [x] Le conteneur tourne bien avec l'utilisateur `node` (vérifié en exécutant `whoami` dans un conteneur de test).
- [x] Le cache Docker marche correctement pour les dépendances.
- [x] Il n'y a aucun outil d'admin inutile d'installé.
