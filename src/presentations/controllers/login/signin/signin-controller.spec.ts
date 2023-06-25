import { test, describe, vi, expect } from "vitest";
import { InvalidParamError, ServerError } from "../../../errors";
import {
  HttpRequest,
  Authentication,
  AuthenticationModel,
} from "./signin-controller-protocols";
import { SignInController } from "./signin-controller";
import { Validation } from "../../../protocols/validation";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../../helpers/http/http-helper";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(data: AuthenticationModel): Promise<string> {
      return new Promise((resolve, reject) => resolve("access_token"));
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutType {
  sut: SignInController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutType => {
  const authentication = makeAuthentication();
  const validation = makeValidation();
  const signinController = new SignInController(authentication, validation);
  return {
    sut: signinController,
    authenticationStub: authentication,
    validationStub: validation,
  };
};

describe("SignIn Controller", () => {
  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authenticationSpy = vi.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, "auth").mockReturnValueOnce(
      new Promise((resolve, reject) => resolve(""))
    );
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(unauthorized());
  });

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, "auth").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new ServerError("")));
  });

  test("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(ok({ accessToken: "access_token" }));
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
