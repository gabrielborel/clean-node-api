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
  HttpRequest,
  Validation,
} from "./signup-protocols";
import { SignUpController } from "./signup";
import { badRequest, created, serverError } from "../../helpers/http-helper";

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  createAccountStub: CreateAccount;
  validationStub: Validation;
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,
    createAccountStub,
    validationStub
  );
  return {
    sut,
    emailValidatorStub,
    createAccountStub,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "validate");
    const request = makeFakeRequest();
    await sut.handle(request);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new ServerError("")));
  });

  test("should call CreateAccount with correct values", async () => {
    const { sut, createAccountStub } = makeSut();
    const createAccountSpy = jest.spyOn(createAccountStub, "create");
    const request = makeFakeRequest();
    await sut.handle(request);
    expect(createAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("should return 500 if CreateAccount throws", async () => {
    const { sut, createAccountStub } = makeSut();
    jest.spyOn(createAccountStub, "create").mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new ServerError("")));
  });

  test("should return 201 if valid data is provided", async () => {
    const { sut } = makeSut();
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(created(makeFakeAccount()));
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const request = makeFakeRequest();
    await sut.handle(request);
    expect(validationSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    validationSpy.mockReturnValueOnce(new MissingParamError("any_field"));
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new MissingParamError("any_field")));
  });
});
