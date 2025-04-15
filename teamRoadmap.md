## Mises à Jour Récentes (Début Avril 2024)

Cette section résume les modifications importantes apportées récemment au projet.

### 1. Refonte Visuelle et Standardisation du Style (Tailwind CSS)

- **Raison:** Unifier le style de l'application, améliorer la responsivité et simplifier la maintenance en adoptant une approche "utility-first".
- **Changement:** Suppression des fichiers CSS dédiés par composant/page (ex: `client.css`, `admin.css`, `Contact.css`, etc.). Le style est désormais géré directement dans les fichiers JSX via les classes utilitaires de Tailwind CSS.
- **Impact:**
  - Refonte de la page d'inscription (`Register.jsx`) pour un look plus moderne inspiré d'une maquette fournie (icônes dans les champs, checklist pour le mot de passe, etc.).
  - Refonte de la page de connexion (`Login.jsx`) pour une meilleure disposition (bouton "Créer un compte" déplacé et stylisé, options de connexion sociale commentées).
  - Correction de l'affichage du bouton "S'abonner" dans la section Newsletter du `Footer.jsx` pour éviter qu'il ne passe à la ligne sur certains écrans.
  - Nettoyage général des styles sur plusieurs composants pour utiliser Tailwind.

### 2. Fonctionnalité : Consultation des Gains Passés (Tableau de Bord Client)

- **Raison:** Permettre aux utilisateurs connectés de voir l'historique de leurs gains.
- **Changements:**
  - **Backend:**
    - Ajout d'une nouvelle route `GET /api/user/my-gains` dans `backend/src/routes/userRoute.js`.
    - Création du contrôleur `getMyGainsController` dans `backend/src/controllers/userController.js` pour récupérer les gains de l'utilisateur authentifié depuis la base de données (collection `gains`).
  - **Frontend:**
    - Intégration dans `frontend/src/pages/Dashbords/ClientDashboard.jsx` :
      - Ajout d'un état pour stocker les gains, le statut de chargement et les erreurs.
      - Appel automatique à la nouvelle route backend après le chargement des informations utilisateur.
      - Affichage des gains dans une nouvelle section "Mes Gains Passés", incluant le numéro de ticket (`ticketNumber`), le lot gagné (`prizeWon`) et sa valeur (`prizeValue`), ainsi que la date (`createdAt`).
      - Correction des noms de champs utilisés pour l'affichage (auparavant incorrects).

### 3. Logique du Jeu (`Game`)

- **Raison n°1:** Permettre aux utilisateurs de jouer plusieurs fois s'ils possèdent plusieurs codes uniques valides (conformément aux règles mises à jour).
- **Changement n°1:** Suppression de la vérification dans `backend/src/controllers/gameController.js` qui empêchait un utilisateur de jouer plus d'une fois. La seule vérification restante concerne la validité et l'unicité du _ticket_ soumis.
  ```javascript
  // Code supprimé/commenté dans gameController.js :
  /*
  // --- Check if user has already played --- // REMOVED THIS CHECK
  const existingGain = await Gain.findOne({ userId: userId });
  if (existingGain) {
    return res.status(400).json({
      success: false,
      message: "Vous avez déjà participé à ce jeu.", // Ancien message
    });
  }
  */
  ```
- **Raison n°2:** Améliorer les performances et la fiabilité lors de la validation d'un ticket.
- **Changement n°2:** Suppression de l'appel à l'API externe `worldclockapi.com` dans `backend/src/controllers/gameController.js`. La date est désormais obtenue directement via `new Date()` sur le serveur, réduisant ainsi la latence réseau.
  ```javascript
  // Code modifié dans gameController.js :
  // AVANT: Appel API externe (supprimé)
  // APRÈS:
  const date = new Date(); // Utilisation de l'heure serveur
  ```
- **Raison n°3:** Fournir un retour plus clair à l'utilisateur en cas de ticket invalide.
- **Changement n°3:** Traduction du message d'erreur pour les tickets invalides ou déjà utilisés en français dans `backend/src/controllers/gameController.js`.
  ```javascript
  // Code modifié dans gameController.js :
  return res.status(400).json({
    success: false,
    // message: "Ticket is invalid or already used.", // Ancien message
    message: "Ticket invalide ou déjà utilisé.", // Nouveau message
  });
  ```

### 4. Correction : Formulaire de Contact

- **Raison:** Le formulaire de contact échouait avec une erreur 404 car l'URL appelée ne correspondait pas à la route définie dans le backend.
- **Changement:** Correction de l'URL dans l'appel `axios.post` dans `frontend/src/pages/Contact/Contact.jsx`.
  ```javascript
  // Code modifié dans Contact.jsx :
  // AVANT: const response = await axios.post('http://localhost:4000/api/contact/send', payload);
  // APRÈS:
  const response = await axios.post(
    "http://localhost:4000/api/contact/",
    payload
  );
  ```

### 5. Configuration : URLs d'API (Local vs Production)

- **Constat:** Actuellement, les appels API depuis le frontend utilisent l'URL de développement local (`http://localhost:4000`).
- **Action Requise (pour la production):** Avant de déployer en production, il faudra remplacer toutes les occurrences de `http://localhost:4000` par l'URL du backend de production.
- **Méthode Recommandée:** Utiliser des variables d'environnement.
  1.  Définir une variable d'environnement (par exemple, `VITE_API_URL` si vous utilisez Vite, ou `REACT_APP_API_URL` pour Create React App) dans un fichier `.env` à la racine de `frontend`.
      - Exemple pour `.env.development`: `VITE_API_URL=http://localhost:4000/api`
      - Exemple pour `.env.production`: `VITE_API_URL=https://www.backend.dsp5-archi-f24a-15m-g3.fr/api` (Adaptez l'URL de production si nécessaire)
  2.  Rechercher toutes les instances de `'http://localhost:4000/api/...'` dans le code source frontend (`frontend/src`).
  3.  Les remplacer par l'utilisation de la variable d'environnement.
      - Si Vite: `import.meta.env.VITE_API_URL + '/auth/login'`
      - Si CRA: `process.env.REACT_APP_API_URL + '/auth/login'`

## Mises à Jour Récentes (Début Avril 2024 - Suite)

Cette section résume les modifications importantes apportées après la génération des tickets et la mise en place de la limite initiale d'une partie par utilisateur.

### 1. Refonte Visuelle et Standardisation du Style (Tailwind CSS) - Suite

- **Raison:** Continuer l'unification du style, améliorer l'expérience utilisateur sur les pages d'authentification et corriger des problèmes mineurs de layout.
- **Changements:**
  - Suppression des fichiers CSS dédiés par composant/page (ex: `client.css`, `admin.css`, `Contact.css`, etc.) si ce n'était pas déjà fait.
  - Refonte de la page d'inscription (`Register.jsx`) pour un look plus moderne inspiré d'une maquette fournie (icônes dans les champs, checklist pour le mot de passe, lien "Déjà membre" déplacé en haut).
  - Refonte de la page de connexion (`Login.jsx`) pour une meilleure disposition (bouton "Créer un compte" déplacé sous le bouton de connexion et stylisé comme un bouton secondaire, options de connexion sociale commentées).
  - Correction de l'affichage du bouton "S'abonner" dans la section Newsletter du `Footer.jsx` pour éviter qu'il ne passe à la ligne sur certains écrans (utilisation de `flex-shrink-0` et `min-w-0`).
  - Nettoyage général des styles sur plusieurs composants pour utiliser Tailwind et suppression des imports CSS inutiles.

### 2. Fonctionnalité : Consultation des Gains Passés (Tableau de Bord Client)

- **Raison:** Implémenter l'affichage de l'historique des gains pour les utilisateurs connectés.
- **Changements:**
  - **Backend:**
    - Ajout d'une nouvelle route `GET /api/user/my-gains` dans `backend/src/routes/userRoute.js`.
    - Création du contrôleur `getMyGainsController` dans `backend/src/controllers/userController.js` pour récupérer les gains de l'utilisateur authentifié (triés par date décroissante) depuis la collection `gains`.
  - **Frontend:**
    - Intégration dans `frontend/src/pages/Dashbords/ClientDashboard.jsx` :
      - Ajout d'un état (`gainsData`, `isLoadingGains`, `errorGains`).
      - Implémentation de la fonction `fetchGains` pour appeler l'endpoint `/api/user/my-gains`.
      - Appel automatique de `fetchGains` après le chargement des informations utilisateur.
      - Affichage des gains dans une nouvelle section "Mes Gains Passés", incluant le numéro de ticket (`ticketNumber`), le lot gagné (`prizeWon`) et sa valeur (`prizeValue`), ainsi que la date (`createdAt`). Le bouton initial "Voir mes gains passés" a été supprimé car l'affichage est automatique.
      - Correction des noms de champs utilisés pour l'affichage (utilisation de `ticketNumber`, `prizeWon`, `prizeValue` au lieu de noms incorrects).

### 3. Logique du Jeu (`Game`) - Modifications

- **Raison n°1:** Permettre aux utilisateurs de jouer plusieurs fois s'ils possèdent plusieurs codes uniques valides (inversion de la règle précédente).
- **Changement n°1:** Suppression (par mise en commentaire) de la vérification dans `backend/src/controllers/gameController.js` qui limitait l'utilisateur à une seule partie. La validation se concentre désormais uniquement sur la validité et l'unicité du _ticket_.
  ```javascript
  // Code commenté dans gameController.js :
  /*
  // --- Check if user has already played --- // REMOVED THIS CHECK
  const existingGain = await Gain.findOne({ userId: userId });
  if (existingGain) {
    return res.status(400).json({
      success: false,
      message: "Vous avez déjà participé à ce jeu.",
    });
  }
  */
  ```
- **Raison n°2:** Améliorer les performances lors de la validation d'un ticket.
- **Changement n°2:** Suppression de l'appel à l'API externe `worldclockapi.com` dans `backend/src/controllers/gameController.js`. Remplacement par `new Date()` pour utiliser l'heure du serveur, réduisant la latence.
  ```javascript
  // Code modifié dans gameController.js :
  const date = new Date(); // Utilisation de l'heure serveur (remplace l'appel API)
  ```
- **Raison n°3:** Améliorer le retour utilisateur.
- **Changement n°3:** Traduction du message d'erreur pour les tickets invalides ou déjà utilisés en français ("Ticket invalide ou déjà utilisé.") dans `backend/src/controllers/gameController.js`.
  ```javascript
  // Message d'erreur modifié dans gameController.js :
  message: "Ticket invalide ou déjà utilisé.",
  ```

### 4. Correction : Formulaire de Contact

- **Raison:** Le formulaire échouait (erreur 404) car l'URL appelée (`/api/contact/send`) n'existait pas.
- **Changement:** Correction de l'URL dans `axios.post` dans `frontend/src/pages/Contact/Contact.jsx` pour pointer vers la bonne route (`/api/contact/`).
  ```javascript
  // URL corrigée dans Contact.jsx :
  const response = await axios.post(
    "http://localhost:4000/api/contact/",
    payload
  );
  ```

### 5. Configuration : URLs d'API (Local vs Production)

- **Constat:** Les appels API depuis le frontend utilisent toujours l'URL de développement local (`http://localhost:4000`).
- **Action Requise (pour la production):** Avant de déployer, remplacer `http://localhost:4000` par l'URL du backend de production.
- **Méthode Recommandée:** Utiliser des variables d'environnement (ex: `VITE_API_URL` ou `REACT_APP_API_URL`).
  1.  Créer/Modifier les fichiers `.env` (ex: `.env.development`, `.env.production`) à la racine de `frontend`.
      - `.env.development`: `VITE_API_URL=http://localhost:4000/api`
      - `.env.production`: `VITE_API_URL=https://www.api.dsp5-archi-f24a-15m-g3.fr/api` (URL à adapter)
  2.  Remplacer les URLs codées en dur dans le code source frontend (ex: `axios.post('http://localhost:4000/api/auth/login', ...)`).
  3.  Utiliser la variable d'environnement à la place (ex: `axios.post(\`\${import.meta.env.VITE_API_URL}/auth/login\`, ...)` si Vite).
