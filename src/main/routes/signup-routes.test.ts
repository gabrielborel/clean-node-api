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

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("SignUp Routes", () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    await MongoHelper.connect(mongo.getUri());
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("should return an account on success", async () => {
    /**
     * IDK why but this timeout is necessary, if not, the test will return 404
     * like the application hasn't build yet and the test make the request
     */
    await timeout(100);
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
