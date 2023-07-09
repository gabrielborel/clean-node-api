import { mockCreateSurvey, mockValidation } from "@/presentations/test";
import { CreateSurveyController } from "./create-survey-controller";
import {
  CreateSurvey,
  HttpRequest,
  Validation,
  badRequest,
  noContent,
  serverError,
} from "./create-survey-controller-protocols";

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
  const validationStub = mockValidation();
  const createSurveyStub = mockCreateSurvey();
  const sut = new CreateSurveyController(validationStub, createSurveyStub);
  return { sut, validationStub, createSurveyStub };
};

describe("CreateSurveyController", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const request = makeFakeRequest();
    const validateSpy = jest.spyOn(validationStub, "validate");
    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 400 if Validation fails", async () => {
    const { sut, validationStub } = makeSut();
    const request = makeFakeRequest();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new Error()));
  });

  test("should call CreateSurvey with correct values", async () => {
    const { sut, createSurveyStub } = makeSut();
    const request = makeFakeRequest();
    const createSpy = jest.spyOn(createSurveyStub, "create");
    await sut.handle(request);
    expect(createSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 500 if CreateSurvey throws", async () => {
    const { sut, createSurveyStub } = makeSut();
    const request = makeFakeRequest();
    jest.spyOn(createSurveyStub, "create").mockImplementationOnce(() => {
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
