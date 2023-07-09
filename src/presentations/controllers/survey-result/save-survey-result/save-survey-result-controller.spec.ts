import { mockSurveyResultModel } from "@/domain/test";
import { mockFindSurveyById, mockSaveSurveyResult } from "@/presentations/test";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  FindSurveyById,
  HttpRequest,
  InvalidParamError,
  SaveSurveyResult,
  created,
  forbidden,
  serverError,
} from "./save-survey-result-protocols";

const makeFakeRequest = (): HttpRequest => ({
  accountId: "any_account_id",
  params: {
    surveyId: "any_survey_id",
  },
  body: {
    answer: "any_answer",
  },
});

type SutType = {
  sut: SaveSurveyResultController;
  findSurveyByIdStub: FindSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutType => {
  const findSurveyById = mockFindSurveyById();
  const saveSurveyResult = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(findSurveyById, saveSurveyResult);
  return {
    sut,
    findSurveyByIdStub: findSurveyById,
    saveSurveyResultStub: saveSurveyResult,
  };
};

describe("SaveSurveyResultController", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should return call FindSurveyById with correct value", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    const findByIdSpy = jest.spyOn(findSurveyByIdStub, "findById");
    await sut.handle(makeFakeRequest());
    expect(findByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  test("should return 403 if FindSurveyById returns null", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    jest.spyOn(findSurveyByIdStub, "findById").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("should return 500 if FindSurveyById throws", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    jest
      .spyOn(findSurveyByIdStub, "findById")
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    httpRequest.body.answer = "wrong_answer";
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  test("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: "any_survey_id",
      accountId: "any_account_id",
      date: new Date(),
      answer: "any_answer",
    });
  });

  test("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 201 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(created(mockSurveyResultModel()));
  });
});
