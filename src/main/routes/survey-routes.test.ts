import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { app } from "../config/app";
import { environment } from "../config/env";

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let surveyCollection: Collection;
let accountCollection: Collection;

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

describe("Survey Routes", async () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    await MongoHelper.connect(mongo.getUri());
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("should return 403 on create survey without accessToken", async () => {
      /**
       * IDK why but this timeout is necessary, if not, the test will return 404
       * like the application hasn't build yet and the test make the request
       */
      await timeout(600);
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
      await timeout(300);
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
      await timeout(600);
      await request(app).get("/api/surveys").expect(403);
    });

    test("should return 204 on load surveys with valid accessToken, but no surveys found", async () => {
      const accessToken = await makeAccessToken();
      await timeout(300);
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
      await timeout(300);
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .send()
        .expect(200);
    });
  });
});
