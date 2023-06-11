import { EmailValidator } from "../../controllers/signup/signup-protocols";
import { InvalidParamError } from "../../errors";
import { EmailValidation } from "./email-validation";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutType {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
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

  test("should return throw if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
