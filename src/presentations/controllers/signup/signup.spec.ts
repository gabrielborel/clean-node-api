import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import {
  EmailValidator,
  AccountModel,
  CreateAccountModel,
  CreateAccount,
} from "./signup-protocols";
import { SignUpController } from "./signup";

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  createAccountStub: CreateAccount;
}

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    create(account: CreateAccountModel): AccountModel {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      };
    }
  }
  return new CreateAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();
  const sut = new SignUpController(emailValidatorStub, createAccountStub);
  return {
    sut,
    emailValidatorStub,
    createAccountStub,
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

  test("should return 500 if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    const request = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test("should call CreateAccount with correct values", () => {
    const { sut, createAccountStub } = makeSut();
    const createAccountSpy = jest.spyOn(createAccountStub, "create");
    const request = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    sut.handle(request);
    expect(createAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("should return 500 if CreateAccount throws", () => {
    const { sut, createAccountStub } = makeSut();
    jest.spyOn(createAccountStub, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const request = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
});
