import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { app } from "@/main/config/app";
import { environment } from "@/main/config/env";
import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

let surveyCollection: Collection;
let accountCollection: Collection;
let mongoServer: MongoMemoryServer;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: "Any Name",
    email: "any_email@mail.com",
    password: "123",
    role: "admin",
  });
  const accessToken = sign({ id: res.insertedId }, environment.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: res.insertedId,
    },
    {
      $set: {
        accessToken,
      },
    }
  );
  return accessToken;
};

describe("Survey Result Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await MongoHelper.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    await mongoServer.stop();
  });

  describe("PUT /surveys/:surveyId/results", () => {
    test("should return 403 on save survey result without accessToken", async () => {
      await request(app)
        .put("/api/surveys/1/results")
        .send({
          answer: "Answer 1",
        })
        .expect(403);
    });
  });
});
