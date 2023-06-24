import { Router } from "express";
import { Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { adaptRoute } from "../adapters/express-route-adapter";
import { app } from "../config/app";
import { makeSignInController } from "../factories/controllers/signin/signin-controller-factory";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";

export default (router: Router) => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/signin", adaptRoute(makeSignInController()));
};

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let surveyCollection: Collection;

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
  });

  describe("POST /surveys", () => {
    test("should return 403 on create survey without accessToken", async () => {
      /**
       * IDK why but this timeout is necessary, if not, the test will return 404
       * like the application hasn't build yet and the test make the request
       */
      await timeout(200);
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
  });
});
