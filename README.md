# Thé Tip Top - Jeu Concours 🎡

## 📌 Description
Thé Tip Top est un site fictif conçu pour un jeu concours en ligne. 
Les utilisateurs peuvent s'inscrire, jouer à une roue de la fortune et gagner des lots tout en disposant d'un code de jeu !

## 🚀 Installation
1. **Cloner le projet**  
git clone https://github.com/Acharaf-Dev/THETIPTOP_GAME.git
cd thetiptop

2. **Installer les dépendances**  
npm install

3. **Exécuter Docker Compose**
**Installer docker sous Linux** 
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
docker --version

**Installer docker_compose sous Linux**
sudo curl -L "https://github.com/docker/compose/releases/download/v2.10.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

**Construire et exécuter les conteneurs**
docker-compose up --build

4. **Lancer le projet**  
npm install
npm start

## Accéder en ligne ou en Localhost via les port de configuration du docker-compose

**En Localhost**
- FRONTEND : http://localhost:3001/
- BACKEND : http://localhost:4000/
- MONGODB : http://localhost:27017/
- JENKINS : http://localhost:8080/
- SONARQUBE : http://localhost:9000/
- PROMETHEUS : http://localhost:9090/
- GRAFANA : http://localhost:3000/
- cADVISOR : http://localhost:8081/
- TRAEFIK : http://localhost:8081/

**SUR VPS**
- FRONTEND : http://161.97.76.223:3001/
- BACKEND : http://161.97.76.223:4000/
- MONGODB : http://161.97.76.223:27017/
- JENKINS : http://161.97.76.223:8080/
- SONARQUBE : http://161.97.76.223:9000/
- PROMETHEUS : http://161.97.76.223:9090/
- GRAFANA : http://161.97.76.223:3000/
- cADVISOR : http://161.97.76.223:8081/
- TRAEFIK : http://161.97.76.223:8081/

**SOUS NOM DE DOMAINE DU WORKFLOW**
- JENKINS : https://www.jenkins.wk-archi-f24a-15M-G8.fr 
- SONARQUBE : https://www.sonarqube.wk-archi-f24a-15M-G8.fr
- PROMETHEUS : https://www.prometheus.wk-archi-f24a-15M-G8.fr
- GRAFANA : https://www.grafana.wk-archi-f24a-15M-G8.fr

**NOM DE DOMAINE DU SITE WEB**
 https://www.dsp5-archi-f24a-15M.G8.fr

**NOM DES BRANCHES**
- main "la branche par défaut ou principale qui est notre branche de production"
- preprod "Notre branche de préproduction"
- develop "C'est notre branche de développement local et de test"

**BONNES PRATIQUES EN TANT QUE DEVELOPPEUR**
- Je crée un ticket avec un nom court ex ( Ticket-01) : (developpeur)
- Depuis mon terminal, je me place sur develop : " git checkout origin develop "
- Je récupère la dernière version de develop : " git pull origin  develop "
- Je vérifie l'état actuel de mon dépot : "git status"
- Je crée une nouvelle branche avant de travailler en fonction du ticket
- Je me place sur la nouvelle branche et je travaille : (developpeur)
        git checkout - b Ticket-01
        git add .
        git commit -m "Ajout de la nouvelle fonctionnalité"
        git push origin Ticket-01
- Je crée une pull request sur GitHub pour fusionner test dans develop.
- Je revoie et validation de la pull request sur GitHub.
- Je fusionne la branche develop dans preprod : (Admin)
        git checkout preprod
        git merge develop
        git push origin preprod
- Je crée une pull request sur GitHub pour fusionner preprod dans main. (Admin)
- Revue et validation de la pull request sur GitHub.
- Je fusionne la branche main :
        git checkout main
        git merge preprod
        git push origin main
- Je reviens à la branche develop et la mettre à jour :
        git checkout develop
        git pull origin main
- Je supprime la branche temporaire si je veux :
git branch -d Ticket-01
git push origin --delete Ticket-01
- Je crée une nouvelle branche si je dois developper une nouvelle fonctionnalité "git checkout -b Ticket-02"
- Répétez ce processus pour chaque nouvelle fonctionnalité. 

**Arborescence projet**
thetiptop-project/
│── backend/
│   ├── config/
│   │   ├── auth.js
│   │   ├── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── gameController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── gameRoutes.js
│   ├── tests/
│   │   ├── user.test.js
│   │   ├── game.test.js
│   ├── Dockerfile
│   ├── Jenkinsfile
│   ├── package.json
│   ├── server.js
│
│── frontend/
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Game.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   ├── styles/
│   │   │   ├── style.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   ├── Dockerfile
│   ├── Jenkinsfile
│   ├── package.json
│
│── workflow/
│   ├── prometheus.yml   #Configuration de Prometheus pour la collecte des métriques.
│   ├── traefik.yml      #Configuration du reverse proxy.
│
│── docker-compose.yml
│── README.md


thanks 