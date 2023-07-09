import { mockSurveyModels } from "@/domain/test";
import { mockFindSurveys } from "@/presentations/test";
import { FindSurveysController } from "./find-surveys-controller";
import {
  FindSurveys,
  noContent,
  ok,
  serverError,
} from "./find-surveys-controller-protocols";

type SutType = {
  sut: FindSurveysController;
  findSurveysStub: FindSurveys;
};

const makeSut = (): SutType => {
  const findSurveys = mockFindSurveys();
  const sut = new FindSurveysController(findSurveys);
  return { sut, findSurveysStub: findSurveys };
};

describe("FindSurveysController", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call FindSurveys", async () => {
    const { sut, findSurveysStub } = makeSut();
    const findSurveysSpy = jest.spyOn(findSurveysStub, "find");
    await sut.handle({});
    expect(findSurveysSpy).toHaveBeenCalled();
  });

  test("should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });

  test("should return 204 if no surveys found", async () => {
    const { sut, findSurveysStub } = makeSut();
    jest.spyOn(findSurveysStub, "find").mockResolvedValueOnce([]);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("should return 500 if FindSurveys throws", async () => {
    const { sut, findSurveysStub } = makeSut();
    jest.spyOn(findSurveysStub, "find").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
