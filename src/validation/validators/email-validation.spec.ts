import { InvalidParamError } from "@/presentations/errors";
import { EmailValidator } from "../protocols/email-validator";
import { EmailValidation } from "./email-validation";
import { mockEmailValidator } from "../test";

type SutType = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutType => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email Validation", () => {
  test("should return an error if EmailValidator returns false", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockReturnValueOnce(false);
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "validate");
    sut.validate({
      email: "any_email@mail.com",
    });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should return nothing if validation succeeds", async () => {
    const { sut } = makeSut();
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toBeNull();
  });

  test("should return throw if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
