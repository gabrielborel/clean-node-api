import { FindSurveyByIdRepository } from "@/data/protocols/db/survey/find-survey-by-id.repository";
import { SurveyModel } from "@/domain/models/survey";
import { FindSurveyById } from "@/domain/use-cases/find-survey-by-id";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { DbFindSurveyById } from "./db-find-survey-by-id";

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

const makeFindSurveyByIdRepositoryStub = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new FindSurveyByIdRepositoryStub();
};

type SutType = {
  sut: FindSurveyById;
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository;
};

const makeSut = (): SutType => {
  const findSurveyByIdRepository = makeFindSurveyByIdRepositoryStub();
  const sut = new DbFindSurveyById(findSurveyByIdRepository);
  return { sut, findSurveyByIdRepositoryStub: findSurveyByIdRepository };
};

describe("DbFindSurveyById Use Case", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test("should call FindSurveyByIdRepository with correct value", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    const findByIdSpy = vi.spyOn(findSurveyByIdRepositoryStub, "findById");
    await sut.findById("any_id");
    expect(findByIdSpy).toHaveBeenCalledWith("any_id");
  });
});
