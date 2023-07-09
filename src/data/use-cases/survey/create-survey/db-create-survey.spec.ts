import { DbCreateSurvey } from "./db-create-survey";
import {
  CreateSurveyModel,
  CreateSurveyRepository,
} from "./db-create-survey-protocols";

const makeCreateSurveyRepositoryStub = (): CreateSurveyRepository => {
  class CreateSurveyRepositoryStub implements CreateSurveyRepository {
    async create(data: CreateSurveyModel): Promise<void> {
      return Promise.resolve();
    }
  }
  return new CreateSurveyRepositoryStub();
};

const makeFakeSurveyData = (): CreateSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

type SutType = {
  sut: DbCreateSurvey;
  createSurveyRepositoryStub: CreateSurveyRepository;
};

const makeSut = (): SutType => {
  const createSurveyRepositoryStub = makeCreateSurveyRepositoryStub();
  const sut = new DbCreateSurvey(createSurveyRepositoryStub);
  return { sut, createSurveyRepositoryStub };
};

describe("DbCreateSurvey Use Case", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call CreateSurveyRepository with correct values", async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createSurveyRepositoryStub, "create");
    const surveyData = makeFakeSurveyData();
    await sut.create(surveyData);
    expect(createSpy).toHaveBeenCalledWith(surveyData);
  });

  test("should throw if CreateSurveyRepository throws", async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(createSurveyRepositoryStub, "create")
      .mockRejectedValueOnce(new Error());
    const promise = sut.create(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
