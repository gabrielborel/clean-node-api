import { mockSaveSurveyResultRepository } from "@/data/test";
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
} from "@/domain/test";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import { SaveSurveyResultRepository } from "./db-save-survey-result-protocols";

type SutType = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutType => {
  const saveSurveyResultRepository = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository);
  return { sut, saveSurveyResultRepositoryStub: saveSurveyResultRepository };
};

describe("DbSaveSurveyResult Use Case", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSurveyResultSpy = jest.spyOn(
      saveSurveyResultRepositoryStub,
      "save"
    );
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSurveyResultSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockRejectedValueOnce(new Error());
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test("should return a SurveyResult on success", async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
