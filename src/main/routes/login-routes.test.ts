import request from "supertest";
import { app } from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import {
  test,
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let accountCollection: Collection;

describe("Login Routes", async () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    await MongoHelper.connect(mongo.getUri());
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /signup", () => {
    test("should return an account on signup", async () => {
      /**
       * IDK why but this timeout is necessary, if not, the test will return 404
       * like the application hasn't build yet and the test make the request
       */
      await timeout(200);
      const response = await request(app).post("/api/signup").send({
        name: "Any Name",
        email: "any_email@mail.com",
        password: "Any Password",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Any Name");
      expect(response.body.email).toBe("any_email@mail.com");
      expect(response.body.password).toBeTruthy();
    });
  });

  describe("POST /signin", () => {
    test("should return success on login", async () => {
      const password = await hash("any password", 12);
      await accountCollection.insertOne({
        name: "Any Name",
        email: "any_email@mail.com",
        password,
      });
      /**
       * IDK why but this timeout is necessary, if not, the test will return 404
       * like the application hasn't build yet and the test make the request
       */
      // await timeout(200);
      const response = await request(app).post("/api/signin").send({
        email: "any_email@mail.com",
        password: "any password",
      });
      expect(response.status).toBe(200);
    });
  });
});
