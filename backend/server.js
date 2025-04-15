require("dotenv").config();  // Charge les variables d'environnement
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

// Conditionner le démarrage du serveur en fonction de l'environnement
if (process.env.NODE_ENV !== "test") { // Vérifie si l'environnement n'est pas 'test'
  // Si l'environnement n'est pas 'test', on se connecte à la base de données
  connectDB().then(() => {
    // Lancer le serveur une fois la connexion à la base réussie
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
    });
  }).catch((err) => {
    console.error('❌ Impossible de se connecter à la base de données', err);
    process.exit(1);
  });
} else {
  // Log pour s'assurer qu'on est en mode test
  console.log('🔬 Environnement de test détecté. Le serveur ne démarre pas.');
}
