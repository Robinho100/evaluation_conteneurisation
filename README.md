# Évaluation Conteneurisation - DevOps Bachelor 2

**Étudiant :** Robin Gonçalves
**Module :** DevOps - Bachelor 2 Développement
**Sujets abordés :** Docker et Docker Compose

Ce dépôt (repository) regroupe l'ensemble des travaux pratiques (TPs) réalisés dans le cadre du module d'évaluation de conteneurisation.

## Architecture du dépôt

Le dépôt est organisé de manière claire, avec un dossier dédié pour chaque TP. 
Chaque dossier contient les fichiers sources du TP ainsi qu'un sous-dossier `rendu` comprenant les réponses aux questions théoriques ou d'analyse.

```text
évaluation_conteneurisation/
├── README.md             # Ce fichier de présentation
├── tp1/                  # TP1 - Réparer une image Docker cassée
│   ├── README.md         # Diagnostic et réparations du TP1
│   ├── Dockerfile        
│   ├── .dockerignore     
│   ├── index.js          
│   └── package.json      
├── tp2/                  # TP2 - Docker Compose & Stack Multi-Services
│   ├── README.md         # Explications techniques du TP2
│   ├── docker-compose.yml# Orchestration des 4 services
│   ├── .env              # Secrets de la BDD (non versionné idéalement)
│   ├── api/              # Fichiers de l'API Node.js
│   └── frontend/         # Fichiers du Frontend Nginx
└── tp3/                  # TP3 - Conteneurisation de TaskFlow
    ├── README.md         # Rapport de conteneurisation TaskFlow
    ├── docker-compose.yml# Orchestration Frontend, Backend, Redis
    ├── .env.example      # Template de variables d'environnement
    ├── backend/          # API Node.js (Dockerfile, code)
    └── frontend/         # Frontend Nginx (Dockerfile, code)
```

## Progression

- [x] **TP1 :** Réparer une image Docker cassée (Dockerfile, layers, sécurité simple)
- [x] **TP2 :** Docker Compose : stack multi-services (Compose, volumes, .env, Adminer)
- [x] **TP3 :** Conteneurisation de TaskFlow (Dockerfiles, Compose, réseaux, Redis)
