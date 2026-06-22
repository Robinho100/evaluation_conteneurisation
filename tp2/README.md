# Rendu TP2 - Docker Compose & Stack Multi-Services

**Étudiant :** Robin Gonçalves
**Module :** DevOps - Bachelor 2 Développement

---

## 1. Mise en place de la stack avec Docker Compose

Pour ce TP, l'objectif était de relier plusieurs conteneurs entre eux (une base de données, une API en Node.js, et un frontend servi par Nginx), sans oublier l'outil Adminer pour gérer facilement la base de données PostgreSQL. 

J'ai tout regroupé dans un fichier `docker-compose.yml`. L'avantage, c'est qu'avec une seule commande (`docker compose up -d --build`), toute l'infrastructure démarre et les réseaux sont automatiquement créés pour que les conteneurs puissent communiquer ensemble.

## 2. Choix techniques, Sécurisation et Stabilisation

### Fichier `.env` pour cacher les secrets
Pour des raisons de sécurité, je n'ai mis aucun mot de passe directement dans le `docker-compose.yml`. J'ai créé un fichier caché `.env` (qui ne doit surtout pas être push sur Git, j'aurais dû le mettre dans un `.gitignore` idéalement). Ce fichier contient les identifiants de la base de données (nom d'utilisateur, mot de passe, nom de la DB). Le fichier Compose vient lire ces variables grâce à la syntaxe `${DB_USER}` et `${DB_PASSWORD}`.
Ainsi, un `grep -i password docker-compose.yml` ne montre aucune valeur en clair.

### La gestion des volumes (db_data)
J'ai déclaré un volume nommé `db_data` (monté sur `/var/lib/postgresql/data` dans le conteneur de la BDD). Si je ne fais pas ça, à chaque fois que je fais un `docker compose down`, je perds toutes les données (les messages enregistrés par l'API). Grâce au volume, la persistance est garantie, même après un redémarrage complet de la stack.

### Stabilisation du Compose (API vs Database)
C'est le point clé du sujet. Souvent, l'API démarre très vite alors que PostgreSQL met quelques secondes à s'initialiser et créer ses structures. Du coup, l'API peut planter direct car elle n'arrive pas à s'y connecter.
Pour éviter ça, j'ai utilisé deux méthodes combinées :
1. **Un `restart: on-failure` sur l'API** : au minimum, ça lui permet de recommencer si la base n'était pas encore levée.
2. **Un `healthcheck` sur la base de données (Bonus) :** Le compose va régulièrement taper la commande `pg_isready` dans le conteneur PostgreSQL (`database`) pour vérifier si la BDD est prête à recevoir des connexions. L'API ne se lance que lorsque ce healthcheck est "healthy" grâce au paramètre `depends_on: condition: service_healthy`.

### Ajout d'Adminer
J'ai rajouté le conteneur `adminer` à la fin, exposé sur le port `8081` de ma machine locale. J'ai aussi ajouté la variable d'environnement `ADMINER_DEFAULT_SERVER: database` pour que l'interface pré-remplisse directement le nom du serveur au chargement de la page.
Comme la BDD (`database`) n'expose pas de ports locaux, elle est sécurisée. Seuls les autres conteneurs du réseau (dont Adminer et l'API) peuvent y accéder.

---
### Vérification des critères de réussite :
- [x] **Frontend accessible :** L'UI s'affiche sur `http://localhost:8080`.
- [x] **API accessible :** Le `http://localhost:3000/health` répond `{"status":"ok"}`.
- [x] **Communication API-BDD :** Je peux poster des messages et ils s'affichent.
- [x] **BDD non exposée :** Pas de ligne `ports:` dans le service `database`.
- [x] **Adminer accessible :** L'interface admin s'affiche sur `http://localhost:8081`.
- [x] **Adminer connecté à la BDD :** Le serveur se pré-remplit bien avec "database".
- [x] **Données persistantes :** Le volume a été déclaré.
- [x] **Pas de secrets en dur :** `.env` créé et exploité.
