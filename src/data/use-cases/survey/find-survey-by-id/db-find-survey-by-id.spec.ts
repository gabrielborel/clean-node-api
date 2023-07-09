import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { DbFindSurveyById } from "./db-find-survey-by-id";
import {
  FindSurveyById,
  FindSurveyByIdRepository,
  SurveyModel,
} from "./db-find-survey-by-id-protocols";

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
    async findById(id: string): Promise<SurveyModel | null> {
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

  test("should throw if FindSurveyByIdRepository throws", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    vi.spyOn(findSurveyByIdRepositoryStub, "findById").mockRejectedValueOnce(
      new Error()
    );
    const promise = sut.findById("any_id");
    await expect(promise).rejects.toThrow();
  });

  test("should return a survey on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.findById("any_id");
    expect(survey).toEqual(makeFakeSurvey());
  });

  test("should return null if FindSurveyByIdRepository returns null", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    vi.spyOn(findSurveyByIdRepositoryStub, "findById").mockResolvedValueOnce(
      null
    );
    const survey = await sut.findById("any_id");
    expect(survey).toBeNull();
  });
});
