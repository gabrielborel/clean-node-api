import request from "supertest";
import { app } from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

let accountCollection: Collection;
let mongoServer: MongoMemoryServer;

describe("Login Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await MongoHelper.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    await mongoServer.stop();
  });

  describe("POST /signup", () => {
    test("should return 201 on signup", async () => {
      const response = await request(app).post("/api/signup").send({
        name: "Any Name",
        email: "any_email@mail.com",
        password: "Any Password",
      });
      expect(response.status).toBe(201);
      expect(response.body.accessToken).toBeTruthy();
    });
  });

  describe("POST /signin", () => {
    test("should return 200 on signin", async () => {
      const password = await hash("any password", 12);
      await accountCollection.insertOne({
        name: "Any Name",
        email: "any_email@mail.com",
        password,
      });
      const response = await request(app).post("/api/signin").send({
        email: "any_email@mail.com",
        password: "any password",
      });
      expect(response.status).toBe(200);
    });
  });

  test("should return 401 on signin", async () => {
    const response = await request(app).post("/api/signin").send({
      email: "any_email@mail.com",
      password: "any password",
    });
    expect(response.status).toBe(401);
  });
});
