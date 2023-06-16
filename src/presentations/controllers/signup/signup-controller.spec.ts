import { InvalidParamError, ServerError } from "../../errors";
import {
  badRequest,
  created,
  serverError,
} from "../../helpers/http/http-helper";
import { SignUpController } from "./signup-controller";
import {
  AccountModel,
  CreateAccount,
  CreateAccountModel,
  HttpRequest,
  Validation,
} from "./signup-controller-protocols";
import { test, describe, vi, expect } from "vitest";

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new CreateAccountStub();
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
  accessToken: "valid_token",
});

interface SutType {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  validationStub: Validation;
}

const makeSut = (): SutType => {
  const createAccountStub = makeCreateAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(createAccountStub, validationStub);
  return {
    sut,
    createAccountStub,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("should call CreateAccount with correct values", async () => {
    const { sut, createAccountStub } = makeSut();
    const createAccountSpy = vi.spyOn(createAccountStub, "create");
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
    vi.spyOn(createAccountStub, "create").mockImplementationOnce(() => {
      return new Promise<AccountModel>((resolve, reject) =>
        reject(new Error())
      );
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
    const validationSpy = vi.spyOn(validationStub, "validate");
    const request = makeFakeRequest();
    await sut.handle(request);
    expect(validationSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = vi.spyOn(validationStub, "validate");
    validationSpy.mockReturnValueOnce(new InvalidParamError("any_field"));
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new InvalidParamError("any_field")));
  });
});
