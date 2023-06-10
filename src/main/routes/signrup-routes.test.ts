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
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("should return an account on success", async () => {
    const response = await request(app).post("/api/signup").send({
      name: "Any Name",
      email: "any_email@mail.com",
      password: "Any Password",
    });
    expect(response.status).toBe(200);
  });
});
