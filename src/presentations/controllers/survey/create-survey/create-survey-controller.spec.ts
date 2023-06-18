import { describe, test, vi, expect } from "vitest";
import { HttpRequest } from "./create-survey-controller-protocols";
import { CreateSurveyController } from "./create-survey-controller";
import { Validation } from "../../../protocols/validation";
import { badRequest } from "../../../helpers/http/http-helper";

class ValidationStub implements Validation {
  validate(data: any): Error | null {
    return null;
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    questions: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
});

interface SutType {
  sut: CreateSurveyController;
  validationStub: ValidationStub;
}

const makeSut = (): SutType => {
  const validationStub = new ValidationStub();
  const sut = new CreateSurveyController(validationStub);
  return { sut, validationStub };
};

describe("CreateSurveyController", () => {
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
});
