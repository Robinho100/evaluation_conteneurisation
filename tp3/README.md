# Rendu TP3 - Conteneurisation de TaskFlow

**Étudiant :** Robin Gonçalves
**Module :** DevOps - Bachelor 2 Développement

---

## 1. Organisation du projet

Le but de ce TP était de "dockeriser" l'application TaskFlow (une API Node.js, une interface web et un cache Redis) afin qu'elle se lance d'un simple `docker compose up --build`, sans nécessiter d'installations complexes sur la machine hôte.

J'ai structuré le code avec deux sous-dossiers (`backend/` et `frontend/`), chacun contenant son propre `Dockerfile` optimisé, ainsi que les fichiers de configuration globaux à la racine.

## 2. Dockerfiles et images

### Le Backend (API Node.js)
Dans le dossier `backend/`, j'ai créé un `Dockerfile` basé sur `node:20-alpine`, qui est une image très légère. 
Pour optimiser le cache de build Docker, j'ai pris soin de copier d'abord le fichier `package.json` et de faire le `npm install`, *avant* de copier le reste du code source. Ainsi, si on ne modifie que le code JS (sans toucher aux dépendances), Docker réutilisera le cache de l'installation des modules, ce qui fait gagner un temps précieux.
Aucun secret n'y est stocké. L'API est servie sur le port 3001.

### Le Frontend (Nginx)
Dans `frontend/`, j'ai utilisé l'image `nginx:alpine`. Le `Dockerfile` est très simple : il se contente de copier le fichier `index.html` (qui sert de maquette pour le TP) dans le dossier par défaut de Nginx (`/usr/share/nginx/html/`). Le port 80 est exposé.

## 3. Le Docker Compose

J'ai créé le fichier `docker-compose.yml` avec les trois services demandés :
1. **frontend** : Construit à partir de `./frontend`, exposé sur le port `8080` de la machine locale.
2. **backend** : Construit à partir de `./backend`, exposé sur le port `3001` de la machine locale. Les variables d'environnement nécessaires pour joindre Redis lui sont passées. J'ai ajouté un `depends_on: cache` et un `restart: on-failure`.
3. **cache** : Utilise l'image `redis:7-alpine`. Il n'y a **aucun port exposé** sur l'hôte (`ports:` n'est pas utilisé) comme demandé dans l'énoncé. Il n'est joignable qu'en interne par le réseau Docker, sous le nom d'hôte `cache`. J'ai aussi ajouté un volume nommé `redis_data` monté sur `/data` pour conserver les données en mémoire de Redis (persistance).

## 4. Fichiers de configuration

- **.env.example** : Fourni à la racine du projet, il sert de modèle et documente les variables nécessaires (`FRONTEND_PORT`, `BACKEND_PORT`, `REDIS_HOST`, etc.). Aucun mot de passe n'y est codé en dur.
- **.dockerignore** : Placé dans le dossier backend (et à la racine), il permet d'exclure les `node_modules` locaux, le fichier `.env` ou encore les fichiers git lors du `COPY . .` dans les Dockerfiles.

Avec tout ça, la stack est robuste, performante, sécurisée et "plug & play" !
