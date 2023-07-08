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
import { MongoSurveyResultRepository } from "./mongo-survey-result-repository";
import { Collection } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";
import { AccountModel } from "@/domain/models/account";

const makeSut = (): MongoSurveyResultRepository => {
  return new MongoSurveyResultRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
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
  const survey = await surveyCollection.findOne({ _id: res.insertedId });
  return MongoHelper.toDomain<SurveyModel>(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
  });
  const account = await accountCollection.findOne({ _id: res.insertedId });
  return MongoHelper.toDomain<AccountModel>(account);
};

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

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
    surveyResultCollection = await MongoHelper.getCollection("survey_results");
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("save()", () => {
    test("should create a survey result if its new", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    test("should update a survey result if its not new", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const surveyResultId = res.insertedId.toString();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: "other_answer",
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(surveyResultId);
      expect(surveyResult.answer).toBe("other_answer");
    });
  });
});
