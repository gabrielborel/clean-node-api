import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  FindSurveyById,
  HttpRequest,
  SurveyModel,
  forbidden,
  serverError,
} from "./save-survey-result-protocols";
import { InvalidParamError } from "@/presentations/errors";

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

const makeFindSurveyByIdStub = (): FindSurveyById => {
  class FindSurveyByIdStub implements FindSurveyById {
    async findById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new FindSurveyByIdStub();
};

const makeFakeRequest = (): HttpRequest => ({
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
};

const makeSut = (): SutType => {
  const findSurveyById = makeFindSurveyByIdStub();
  const sut = new SaveSurveyResultController(findSurveyById);
  return { sut, findSurveyByIdStub: findSurveyById };
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
});
