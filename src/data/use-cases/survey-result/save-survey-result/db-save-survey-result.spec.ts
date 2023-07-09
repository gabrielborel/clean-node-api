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
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);
    expect(saveSurveyResultSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockRejectedValueOnce(new Error());
    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });

  test("should return a SurveyResult on success", async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });
});
