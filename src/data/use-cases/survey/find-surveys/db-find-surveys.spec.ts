import { mockFindSurveysRepository } from "@/data/test";
import { mockSurveyModels } from "@/domain/test";
import { DbFindSurveys } from "./db-find-surveys";
import {
  FindSurveys,
  FindSurveysRepository,
} from "./db-find-surveys-protocols";

type SutType = {
  sut: FindSurveys;
  findSurveysRepositoryStub: FindSurveysRepository;
};

const makeSut = (): SutType => {
  const findSurveysRepository = mockFindSurveysRepository();
  const sut = new DbFindSurveys(findSurveysRepository);
  return { sut, findSurveysRepositoryStub: findSurveysRepository };
};

describe("DbFindSurveys Use Case", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call FindSurveysRepository", async () => {
    const { sut, findSurveysRepositoryStub } = makeSut();
    const findAllSpy = jest.spyOn(findSurveysRepositoryStub, "findAll");
    await sut.find();
    expect(findAllSpy).toHaveBeenCalled();
  });

  test("should return a list of surveys on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.find();
    expect(surveys).toEqual(mockSurveyModels());
  });

  test("should throw if FindSurveysRepository throws", async () => {
    const { sut, findSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(findSurveysRepositoryStub, "findAll")
      .mockRejectedValueOnce(new Error());
    const promise = sut.find();
    await expect(promise).rejects.toThrow();
  });
});
