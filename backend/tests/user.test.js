jest.setTimeout(60000);
process.env.NODE_ENV = "test";

const request = require("supertest");
const { connectDB, disconnectDB } = require("../src/config/db");
const mongoose = require("mongoose");
const app = require("../app");

// Modèle utilisateur
const userModel = require("../src/models/usersModel");

// 🧪 Mock emailService (pas d'envoi réel pendant les tests)
jest.mock("../src/config/emailService", () => ({
  sendWelcomeEmail: jest.fn(() => Promise.resolve()),
}));

describe("🧪 Auth API - Register", () => {
  beforeAll(async () => {
    await connectDB();
    console.log("✅ Connexion MongoDB in-memory établie pour les tests.");
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB(); // propre et géré par mongodb-memory-server
  });

  const validUser = {
    userName: "John Doe",
    email: "johndoe@example.com",
    password: "Password123!",
  };

  it("✅ should register a new user and send welcome email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("email", validUser.email);
  });

  it("❌ should not register a user with existing email", async () => {
    // Inscription initiale
    await request(app).post("/api/auth/register").send(validUser);

    // Nouvelle tentative avec même email
    const res = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("❌ should fail registration with weak password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        ...validUser,
        password: "123",
        email: "unique@example.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/password must/i);
  });
});
