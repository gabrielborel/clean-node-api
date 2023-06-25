import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { FindSurveysController } from "./find-surveys-controller";
import { FindSurveys, SurveyModel } from "./find-surveys-controller-protocols";
import { ok, serverError } from "../../../helpers/http/http-helper";

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "any_id_2",
      question: "any_question_2",
      answers: [
        {
          image: "any_image_2",
          answer: "any_answer_2",
        },
      ],
      date: new Date(),
    },
  ];
};

const makeFindSurveysStub = (): FindSurveys => {
  class FindSurveysStub {
    async find(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }
  return new FindSurveysStub();
};

interface SutType {
  sut: FindSurveysController;
  findSurveysStub: FindSurveys;
}

const makeSut = (): SutType => {
  const findSurveys = makeFindSurveysStub();
  const sut = new FindSurveysController(findSurveys);
  return { sut, findSurveysStub: findSurveys };
};

describe("FindSurveysController", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test("should call FindSurveys", async () => {
    const { sut, findSurveysStub } = makeSut();
    const findSurveysSpy = vi.spyOn(findSurveysStub, "find");
    await sut.handle({});
    expect(findSurveysSpy).toHaveBeenCalled();
  });

  test("should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });

  test("should return 500 if FindSurveys throws", async () => {
    const { sut, findSurveysStub } = makeSut();
    vi.spyOn(findSurveysStub, "find").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
