import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/prismaClient";

describe("Authentication API", () => {
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const password = "password123";

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "test-",
        },
      },
    });
    await prisma.$disconnect();
  });

  it("should successfully register a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: password,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe(uniqueEmail);
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  it("should fail registration with short password", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Fail User",
        email: `fail-${Date.now()}@example.com`,
        password: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should successfully log in and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(uniqueEmail);
  });

  it("should reject login with incorrect credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
