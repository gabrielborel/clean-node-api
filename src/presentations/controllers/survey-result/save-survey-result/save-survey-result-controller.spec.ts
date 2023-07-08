import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  FindSurveyById,
  HttpRequest,
  SurveyModel,
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
});
