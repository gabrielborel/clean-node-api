import request from "supertest";
import { app } from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL);
    }
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("should return an account on success", async () => {
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
