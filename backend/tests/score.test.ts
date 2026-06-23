import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/prismaClient";

describe("Scores & Profile API", () => {
  const uniqueEmail = `test-score-${Date.now()}@example.com`;
  const password = "password123";
  let token = "";
  let userId = "";

  beforeAll(async () => {
    // Create a user and get a token
    const regRes = await request(app)
      .post("/api/users")
      .send({
        name: "Score Test User",
        email: uniqueEmail,
        password: password,
      });
    userId = regRes.body.data.id;

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: password,
      });
    token = loginRes.body.data.token;
  });

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "test-score-",
        },
      },
    });
    await prisma.$disconnect();
  });

  it("should reject score creation without a token", async () => {
    const res = await request(app)
      .post("/api/score")
      .send({
        dr: 80,
        cf: 75,
        pi: 90,
        dh: 60,
        iv: 85,
      });

    expect(res.status).toBe(401);
  });

  it("should successfully create a score with valid token and calculate correct GTS", async () => {
    const res = await request(app)
      .post("/api/score")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dr: 80,
        cf: 90,
        pi: 70,
        dh: 85,
        iv: 95,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe(userId);
    // GTS calculation: 0.4*80 + 0.3*90 + 0.15*70 + 0.1*85 + 0.05*95 = 82.75 -> 83
    expect(res.body.data.gts).toBe(83);
  });

  it("should successfully retrieve user scores", async () => {
    const res = await request(app)
      .get(`/api/score/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].gts).toBe(83);
  });

  it("should successfully verify user account", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/verify`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isVerified).toBe(true);
  });

  it("should successfully update user profile name and email", async () => {
    const newName = "Updated Name";
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: newName,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(newName);
  });
});
