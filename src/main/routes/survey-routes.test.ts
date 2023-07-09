import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { app } from "@/main/config/app";
import { environment } from "@/main/config/env";

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

describe("Survey Routes", () => {
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

  describe("POST /surveys", () => {
    test("should return 403 on create survey without accessToken", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Any Question",
          answers: [
            {
              image: "http://image-name.com",
              answer: "Answer 1",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(403);
    });

    test("should return 204 on create survey with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "Any Question",
          answers: [
            {
              image: "http://image-name.com",
              answer: "Answer 1",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    test("should return 403 on load surveys without accessToken", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    test("should return 204 on load surveys with valid accessToken, but no surveys found", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .send()
        .expect(204);
    });

    test("should return 200 on load surveys with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await surveyCollection.insertMany([
        {
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
          ],
          date: new Date(),
        },
      ]);
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .send()
        .expect(200);
    });
  });
});
