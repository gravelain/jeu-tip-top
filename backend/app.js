// Charger les variables d'environnement AVANT toute autre chose
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db"); // Importation de connectDB depuis l'objet exporté

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const gameRoutes = require("./src/routes/gameRoute");
const contactRoutes = require("./src/routes/contactRoute");

const app = express();

// Connexion à la base de données
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Middleware de logging (hors test)
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
  });
}

// Origines autorisées
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
  "http://www.dsp5-archi-f24a-15m-g3.fr",
  "https://www.dsp5-archi-f24a-15m-g3.fr",
  "https://dsp5-archi-f24a-15m-g3.fr",
];

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowedOrigin => allowedOrigin.toLowerCase() === origin.toLowerCase())) {
      return callback(null, true);
    }
    const msg = `❌ CORS : L'origine '${origin}' n'est pas autorisée.`;
    console.error(msg);
    return callback(new Error(msg), false);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middlewares globaux
app.use(express.json());
app.use(cors(corsOptions));

// Test simple
app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

// Routes API
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

// Export de l'app pour server.js ou tests
module.exports = app;
