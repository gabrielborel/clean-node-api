import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  FindSurveyById,
  HttpRequest,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyModel,
  forbidden,
  serverError,
  SurveyResultModel,
  InvalidParamError,
} from "./save-survey-result-protocols";

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_survey_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  surveyId: "any_survey_id",
  accountId: "any_account_id",
  answer: "any_answer",
  date: new Date(),
});

const makeFindSurveyByIdStub = (): FindSurveyById => {
  class FindSurveyByIdStub implements FindSurveyById {
    async findById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new FindSurveyByIdStub();
};

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }
  return new SaveSurveyResultStub();
};

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
  const findSurveyById = makeFindSurveyByIdStub();
  const saveSurveyResult = makeSaveSurveyResultStub();
  const sut = new SaveSurveyResultController(findSurveyById, saveSurveyResult);
  return {
    sut,
    findSurveyByIdStub: findSurveyById,
    saveSurveyResultStub: saveSurveyResult,
  };
};

describe("SaveSurveyResultController", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test("should return call FindSurveyById with correct value", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    const findByIdSpy = vi.spyOn(findSurveyByIdStub, "findById");
    await sut.handle(makeFakeRequest());
    expect(findByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  test("should return 403 if FindSurveyById returns null", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    vi.spyOn(findSurveyByIdStub, "findById").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("should return 500 if FindSurveyById throws", async () => {
    const { sut, findSurveyByIdStub } = makeSut();
    vi.spyOn(findSurveyByIdStub, "findById").mockRejectedValueOnce(new Error());
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
    const saveSpy = vi.spyOn(saveSurveyResultStub, "save");
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
    vi.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
