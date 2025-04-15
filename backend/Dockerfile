# Utiliser Node.js comme image de base
FROM --platform=linux/amd64 node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer jest-junit et Nodemon globalement
RUN npm install --save-dev jest-junit
RUN npm install -g nodemon

# Copier le reste du code source
COPY . .

# Exposer le port 4000 pour l'API
EXPOSE 4000

# Lancer l'application avec Nodemon pour le développement
CMD ["nodemon", "server.js"]
