import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from "./db-save-survey-result-protocols";

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  surveyId: "any_survey_id",
  accountId: "any_account_id",
  answer: "any_answer",
  date: new Date(),
});

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: "any_survey_id",
  accountId: "any_account_id",
  answer: "any_answer",
  date: new Date(),
});

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

type SutType = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutType => {
  const saveSurveyResultRepository = makeSaveSurveyResultRepositoryStub();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository);
  return { sut, saveSurveyResultRepositoryStub: saveSurveyResultRepository };
};

describe("DbSaveSurveyResult Use Case", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test("should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSurveyResultSpy = vi.spyOn(
      saveSurveyResultRepositoryStub,
      "save"
    );
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);
    expect(saveSurveyResultSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    vi.spyOn(saveSurveyResultRepositoryStub, "save").mockRejectedValueOnce(
      new Error()
    );
    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });
});
