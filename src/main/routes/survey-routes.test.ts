import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";
import { makeSignInController } from "../factories/controllers/signin/signin-controller-factory";

export default (router: Router) => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/signin", adaptRoute(makeSignInController()));
};
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
    test("should return 204 on create survey success", async () => {
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
        .expect(204);
    });
  });
});
