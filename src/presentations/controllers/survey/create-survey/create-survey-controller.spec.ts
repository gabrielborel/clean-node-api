import { describe, test, vi, expect, beforeAll, afterAll } from "vitest";
import {
  CreateSurvey,
  CreateSurveyModel,
  HttpRequest,
} from "./create-survey-controller-protocols";
import { CreateSurveyController } from "./create-survey-controller";
import { Validation } from "../../../protocols/validation";
import {
  badRequest,
  noContent,
  serverError,
} from "../../../helpers/http/http-helper";

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeCreateSurveyStub = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create(data: CreateSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new CreateSurveyStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
});

type SutType = {
  sut: CreateSurveyController;
  validationStub: Validation;
  createSurveyStub: CreateSurvey;
};

const makeSut = (): SutType => {
  const validationStub = makeValidationStub();
  const createSurveyStub = makeCreateSurveyStub();
  const sut = new CreateSurveyController(validationStub, createSurveyStub);
  return { sut, validationStub, createSurveyStub };
};

describe("CreateSurveyController", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const request = makeFakeRequest();
    const validateSpy = vi.spyOn(validationStub, "validate");
    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 400 if Validation fails", async () => {
    const { sut, validationStub } = makeSut();
    const request = makeFakeRequest();
    vi.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new Error()));
  });

  test("should call CreateSurvey with correct values", async () => {
    const { sut, createSurveyStub } = makeSut();
    const request = makeFakeRequest();
    const createSpy = vi.spyOn(createSurveyStub, "create");
    await sut.handle(request);
    expect(createSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 500 if CreateSurvey throws", async () => {
    const { sut, createSurveyStub } = makeSut();
    const request = makeFakeRequest();
    vi.spyOn(createSurveyStub, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new Error()));
  });

  test("should return 204 on success", async () => {
    const { sut } = makeSut();
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(noContent());
  });
});
