const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server'); // ✅ Ajouté

// Charger le bon fichier .env sauf en mode test
if (process.env.NODE_ENV !== 'test') {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.prod'
                : process.env.NODE_ENV === 'preprod' ? '.env.preprod'
                : '.env.dev';

  dotenv.config({ path: path.resolve(__dirname, envFile) });

  console.log("📄 Loaded env file:", envFile);
  console.log("MongoDB URI:", process.env.MONGO_URI);
  console.log("API Key:", process.env.API_KEY);
}

let mongoMemory; // Référence pour pouvoir arrêter plus tard en mode test

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    let uri;

    if (process.env.NODE_ENV === 'test') {
      mongoMemory = await MongoMemoryServer.create();
      uri = mongoMemory.getUri(); // 👈 utilise Mongo en mémoire
      console.log("🧪 Using in-memory MongoDB at:", uri);
    } else {
      switch (process.env.NODE_ENV) {
        case 'production':
          uri = process.env.MONGO_URI;
          break;
        case 'preprod':
          uri = process.env.MONGO_URI_PREPROD;
          break;
        case 'development':
          uri = process.env.MONGO_URI_DEV;
          break;
        default:
          throw new Error('NODE_ENV non défini correctement');
      }
      console.log("📡 URI utilisée :", uri);
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connexion MongoDB réussie !');
  } catch (err) {
    console.error('❌ Erreur MongoDB :', err.message);
    throw new Error('Erreur de connexion à MongoDB');
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemory) {
    await mongoMemory.stop(); // 🧹 arrête la base mémoire
  }
};

module.exports = { connectDB, disconnectDB };
