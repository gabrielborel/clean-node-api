import { describe, expect, test, vi } from "vitest";
import { SurveyModel } from "../../../domain/models/survey";
import { FindSurveysRepository } from "../../protocols/db/survey/find-surveys-repository";
import { FindSurveys } from "../../../domain/use-cases/find-surveys";
import { DbFindSurveys } from "./db-find-surveys";

const makeFindSurveysRepositoryStub = (): FindSurveysRepository => {
  class FindSurveysRepositoryStub implements FindSurveysRepository {
    async findAll(): Promise<SurveyModel[]> {
      return Promise.resolve([]);
    }
  }
  return new FindSurveysRepositoryStub();
};

interface SutType {
  sut: FindSurveys;
  findSurveysRepositoryStub: FindSurveysRepository;
}

const makeSut = (): SutType => {
  const findSurveysRepository = makeFindSurveysRepositoryStub();
  const sut = new DbFindSurveys(findSurveysRepository);
  return { sut, findSurveysRepositoryStub: findSurveysRepository };
};

describe("DbFindSurveys Use Case", () => {
  test("should call LoadSurveysRepository", async () => {
    const { sut, findSurveysRepositoryStub } = makeSut();
    const findAllSpy = vi.spyOn(findSurveysRepositoryStub, "findAll");
    await sut.find();
    expect(findAllSpy).toHaveBeenCalled();
  });
});
