jest.setTimeout(60000);
process.env.NODE_ENV = "test";

const request = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../src/config/db");
const app = require("../app");

let userModel;
let ticketModel;
let clientToken;

beforeAll(async () => {
  await connectDB();
  console.log("🧪 Base de test utilisée :", mongoose.connection.name);

  // Charger les modèles après connexion
  userModel = require("../src/models/usersModel");
  ticketModel = require("../src/models/winningTicket");

  // Nettoyer la base
  await userModel.deleteMany({});
  await ticketModel.deleteMany({});

  // Setup des données de test
  const normalizedEmail = "bertille.ducamps@gmail.com";
  const rawPassword = "Gamepass123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await ticketModel.create({
    ticketNumber: "3T-UOAR253",
    prizeValue: 100,
    prizeWon: "Carte cadeau Amazon",
    isUsed: false,
  });

  await userModel.create({
    userName: "GameClient",
    email: normalizedEmail,
    password: hashedPassword,
    phone: "06 06 06 06 06",
    address: ["Vincennes", "Paris"],
    userType: "client",
    answer: "test",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: normalizedEmail,
    password: rawPassword,
  });

  clientToken = loginRes.body.token;
  console.log("✅ Token JWT généré :", clientToken);
});

afterAll(async () => {
  await disconnectDB(); // 👈 proprement
});

describe("🎲 Game API", () => {
  it("✅ should allow client to play with a valid ticket", async () => {
    const res = await request(app)
      .post("/api/game/play")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ ticketNumber: "3T-UOAR253" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toMatch(/Congratulations/i);
  });

  it("❌ should reject replay with same ticket", async () => {
    const res = await request(app)
      .post("/api/game/play")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ ticketNumber: "3T-UOAR253" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/déjà utilisé/i);
  });

  it("❌ should fail with invalid ticket", async () => {
    const res = await request(app)
      .post("/api/game/play")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ ticketNumber: "INVALID-999" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Ticket invalide/i);
  });
});
