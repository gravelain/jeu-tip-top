# Guide de Mise en Production - Thé Tip Top Game

Ce document explique les étapes nécessaires pour configurer et déployer l'application Thé Tip Top Game en environnement de production, en se concentrant sur la gestion des URLs d'API et la configuration Docker.

## 1. Contexte : Différence Localhost vs Production

En développement, le frontend (React) communique avec le backend (Node.js/Express) via `http://localhost:4000/api/...`. Cela fonctionne car les deux s'exécutent sur votre machine.

En production, le frontend est servi via son nom de domaine public (ex: `www.dsp5-archi-f24a-15m-g8.fr`) et doit communiquer avec le backend via *son* nom de domaine public (ex: `https://www.www.backend.dsp5-archi-f24a-15m-g3.fr/api`). L'utilisation de `localhost` ne fonctionnera pas sur le serveur de production car le backend n'écoute pas sur le `localhost` *du navigateur de l'utilisateur*.

Les problèmes d'inscription ou de connexion rencontrés précédemment en production étaient probablement dus à cette mauvaise configuration des URLs.

## 2. Solution : Utilisation des Variables d'Environnement (Frontend)

La méthode standard pour gérer ces différences d'URL est d'utiliser des variables d'environnement.

**Étapes :**

1.  **Créer/Vérifier les Fichiers `.env`:**
    *   À la racine du dossier `frontend`, assurez-vous d'avoir les fichiers suivants :
        *   `.env.development`: Pour la configuration locale.
        *   `.env.production`: Pour la configuration du serveur de production.
2.  **Définir les Variables d'URL d'API:**
    *   Dans `.env.development`:
        ```env
        # Assurez-vous que le nom VITE_ commence si vous utilisez Vite
        VITE_API_URL=http://localhost:4000/api
        ```
    *   Dans `.env.production` (Adaptez l'URL si nécessaire):
        ```env
        # Utilisez HTTPS car Traefik est configuré pour la redirection
        VITE_API_URL=https://www.backend.dsp5-archi-f24a-15m-g3.fr/api
        ```
3.  **Modifier le Code Frontend:**
    *   Remplacez toutes les URLs codées en dur (`'http://localhost:4000/api/...'`) dans les fichiers `.jsx` (`Login.jsx`, `Register.jsx`, `Game.jsx`, `ClientDashboard.jsx`, `Contact.jsx`, etc.).
    *   Utilisez la variable d'environnement à la place. **Exemple (avec Vite)** :
        ```javascript
        // Dans Login.jsx (et autres fichiers similaires)
        // Remplacer :
        // await axios.post("http://localhost:4000/api/auth/login", ...);
        // Par :
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, ...);
        ```
    *   **Action:** Cette refonte du code pour utiliser `import.meta.env.VITE_API_URL` doit être appliquée à tous les appels API dans le dossier `frontend/src`.
4.  **Ignorer les Fichiers `.env` dans Git:**
    *   Vérifiez que votre fichier `.gitignore` contient les lignes suivantes pour exclure ces fichiers du versionnement :
        ```
        .env
        .env.*
        !.env.example
        ```

## 3. Configuration Docker pour la Production

### 3.1. `docker-compose.yml`

*   **Problème:** Les sections `ports:` dans les services `frontend` et `backend` sont utiles en développement pour accéder directement via `localhost:PORT`, mais ne sont pas nécessaires (et potentiellement conflictuelles) en production lorsque Traefik gère tout le trafic entrant (ports 80/443).
*   **Action Recommandée (pour la version production du `docker-compose.yml`):**
    *   Commentez ou supprimez les lignes `ports:` pour les services `frontend` et `backend`. Traefik communiquera avec eux via le réseau Docker interne (`web`).
    ```yaml
    services:
      frontend:
        # ... build, container_name ...
        # ports: <-- COMMENTER OU SUPPRIMER EN PRODUCTION
        #  - "4200:4200"
        labels: # Traefik labels sont essentiels
          - "traefik.enable=true"
          # ...
      backend:
        # ... build, container_name ...
        # ports: <-- COMMENTER OU SUPPRIMER EN PRODUCTION
        #  - "4000:4000"
        labels: # Traefik labels sont essentiels
           - "traefik.enable=true"
           # ...
    ```

### 3.2. `frontend/Dockerfile`

*   **Problème:** Le `Dockerfile` actuel pour le frontend est probablement configuré pour le développement (lance un serveur de développement `npm run dev` ou similaire). En production, il faut servir des fichiers statiques optimisés.
*   **Action Requise:** Adapter le `frontend/Dockerfile` pour un build de production.
    *   **Étape 1 (Build):** Utiliser une image Node pour installer les dépendances (`npm install`) et builder l'application (`npm run build`). Cela génère un dossier (`build` ou `dist`) avec les fichiers statiques.
    *   **Étape 2 (Serve):** Utiliser une image de serveur web légère (comme `nginx`) et copier les fichiers statiques de l'étape précédente dans le répertoire servi par Nginx. Configurer Nginx pour servir l'application React correctement (gestion du routing côté client).
    *   **Exemple Simplifié (Conceptuel):**
        ```dockerfile
        # Étape 1: Build
        FROM node:18 as builder
        WORKDIR /app
        COPY package*.json ./
        RUN npm install
        COPY . .
        # Définit VITE_API_URL au moment du build si nécessaire (ou utiliser args)
        # ARG VITE_API_URL
        # ENV VITE_API_URL=$VITE_API_URL
        RUN npm run build # Crée le dossier /app/dist (ou build)

        # Étape 2: Serve
        FROM nginx:alpine
        # Copier la configuration Nginx personnalisée si nécessaire
        # COPY nginx.conf /etc/nginx/conf.d/default.conf
        # Copier les fichiers buildés
        COPY --from=builder /app/dist /usr/share/nginx/html
        EXPOSE 80
        CMD ["nginx", "-g", "daemon off;"]
        ```
    *   **Note:** La configuration Nginx (`nginx.conf`) est souvent nécessaire pour gérer le routing React (faire en sorte que toutes les routes non-API renvoient `index.html`).

## 4. Déploiement sur le Serveur

1.  Assurez-vous que le code source mis à jour (avec utilisation des variables d'env) est présent sur le serveur.
2.  Vérifiez que le fichier `frontend/.env.production` est bien présent et contient la bonne `VITE_API_URL`.
3.  Assurez-vous que le `frontend/Dockerfile` est adapté pour la production.
4.  Vérifiez/Adaptez le `docker-compose.yml` sur le serveur (sans les `ports:` superflus).
5.  Lancez la commande pour reconstruire et redémarrer :
    ```bash
    docker compose up --build -d
    ```

En suivant ces étapes, votre application devrait utiliser les bonnes URL en production, résolvant ainsi les problèmes de communication entre le frontend et le backend.

**Liens d'accès**
## https://www.dsp5-archi-f24a-15m-g3.fr/
## https://www.jenkins.dsp5-archi-f24a-15m-g3.fr/
## https://www.grafana.dsp5-archi-f24a-15m-g3.fr/
## https://www.prometheus.dsp5-archi-f24a-15m-g3.fr/
## https://www.sonarqube.dsp5-archi-f24a-15m-g3.fr/
