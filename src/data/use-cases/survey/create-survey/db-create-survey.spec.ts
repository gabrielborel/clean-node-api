import { mockCreateSurveyRepository } from "@/data/test/mock-db-survey";
import { DbCreateSurvey } from "./db-create-survey";
import { CreateSurveyRepository } from "./db-create-survey-protocols";
import { mockCreateSurveyParams } from "@/domain/test";

type SutType = {
  sut: DbCreateSurvey;
  createSurveyRepositoryStub: CreateSurveyRepository;
};

const makeSut = (): SutType => {
  const createSurveyRepositoryStub = mockCreateSurveyRepository();
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
    const surveyData = mockCreateSurveyParams();
    await sut.create(surveyData);
    expect(createSpy).toHaveBeenCalledWith(surveyData);
  });

  test("should throw if CreateSurveyRepository throws", async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(createSurveyRepositoryStub, "create")
      .mockRejectedValueOnce(new Error());
    const promise = sut.create(mockCreateSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
