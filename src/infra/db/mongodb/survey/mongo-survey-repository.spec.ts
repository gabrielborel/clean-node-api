import {
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoHelper } from "../helpers/mongo-helper";
import { MongoSurveyRepository } from "./mongo-survey-repository";
import { Collection } from "mongodb";

const makeSut = (): MongoSurveyRepository => {
  return new MongoSurveyRepository();
};

let surveyCollection: Collection;

describe("MongoDB Survey Repository", () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await MongoHelper.connect(uri);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  test("should create a survey on success", async () => {
    const sut = makeSut();
    await sut.create({
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
        {
          answer: "other_answer",
        },
      ],
      date: new Date(),
    });
    const survey = await surveyCollection.findOne({ question: "any_question" });
    expect(survey).toBeTruthy();
  });

  test("should return an array of surveys on success", async () => {
    const sut = makeSut();
    await surveyCollection.insertMany([
      {
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
          {
            answer: "other_answer",
          },
        ],
        date: new Date(),
      },
      {
        question: "other_question",
        answers: [
          {
            image: "other_image",
            answer: "other_answer",
          },
          {
            answer: "other_answer",
          },
        ],
        date: new Date(),
      },
    ]);
    const surveys = await sut.findAll();
    expect(surveys.length).toBe(2);
    expect(surveys[0].question).toBe("any_question");
    expect(surveys[1].question).toBe("other_question");
  });

  test("should return an empty array if there are no surveys", async () => {
    const sut = makeSut();
    const surveys = await sut.findAll();
    expect(surveys.length).toBe(0);
  });
});
