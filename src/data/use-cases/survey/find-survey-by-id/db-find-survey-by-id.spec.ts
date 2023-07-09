import { mockFindSurveyByIdRepository } from "@/data/test";
import { mockSurveyModel } from "@/domain/test";
import { DbFindSurveyById } from "./db-find-survey-by-id";
import {
  FindSurveyById,
  FindSurveyByIdRepository,
} from "./db-find-survey-by-id-protocols";

type SutType = {
  sut: FindSurveyById;
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository;
};

const makeSut = (): SutType => {
  const findSurveyByIdRepository = mockFindSurveyByIdRepository();
  const sut = new DbFindSurveyById(findSurveyByIdRepository);
  return { sut, findSurveyByIdRepositoryStub: findSurveyByIdRepository };
};

describe("DbFindSurveyById Use Case", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call FindSurveyByIdRepository with correct value", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositoryStub, "findById");
    await sut.findById("any_id");
    expect(findByIdSpy).toHaveBeenCalledWith("any_id");
  });

  test("should throw if FindSurveyByIdRepository throws", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(findSurveyByIdRepositoryStub, "findById")
      .mockRejectedValueOnce(new Error());
    const promise = sut.findById("any_id");
    await expect(promise).rejects.toThrow();
  });

  test("should return a survey on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.findById("any_id");
    expect(survey).toEqual(mockSurveyModel());
  });

  test("should return null if FindSurveyByIdRepository returns null", async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(findSurveyByIdRepositoryStub, "findById")
      .mockResolvedValueOnce(null);
    const survey = await sut.findById("any_id");
    expect(survey).toBeNull();
  });
});
