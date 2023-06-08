import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutType => {
  class EmailValidatorStub {
    validate(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("name"));
  });

  test("should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any_name",
        email: "",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("email"));
  });

  test("should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("password"));
  });

  test("should return 400 if a invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockReturnValueOnce(false);
    const request = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError("email"));
  });

  test("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "validate");
    const request = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    sut.handle(request);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
