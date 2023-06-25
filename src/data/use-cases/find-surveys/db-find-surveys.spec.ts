import { describe, expect, test, vi } from "vitest";
import { SurveyModel } from "../../../domain/models/survey";
import { FindSurveysRepository } from "../../protocols/db/survey/find-surveys-repository";
import { FindSurveys } from "../../../domain/use-cases/find-surveys";
import { DbFindSurveys } from "./db-find-surveys";

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

const makeFindSurveysRepositoryStub = (): FindSurveysRepository => {
  class FindSurveysRepositoryStub implements FindSurveysRepository {
    async findAll(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
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

  test("should return a list of surveys on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.find();
    expect(surveys).toEqual(makeFakeSurveys());
  });
});
