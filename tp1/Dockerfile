FROM node:18-alpine

WORKDIR /app

# Copie des fichiers package.json en premier pour exploiter le cache Docker
COPY package*.json ./

# Installation des dépendances (permet le cache si package.json n'a pas changé)
RUN npm install

# Copie du reste du code source
COPY . .

# Construction du projet
RUN npm run build

# On s'assure que le dossier de données existe et appartient à l'utilisateur node, 
# tout comme le reste des fichiers de l'application
RUN mkdir -p /app/data && chown -R node:node /app

# Changement d'utilisateur pour ne plus être root (sécurité)
USER node

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/index.js"]
