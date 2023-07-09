import { InvalidParamError, ServerError } from "@/presentations/errors";
import {
  HttpRequest,
  Authentication,
  AuthenticationParams,
} from "./signin-controller-protocols";
import { SignInController } from "./signin-controller";
import { Validation } from "@/presentations/protocols/validation";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "@/presentations/helpers/http/http-helper";
import { mockAuthentication, mockValidation } from "@/presentations/test";

const mockRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

type SutType = {
  sut: SignInController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutType => {
  const authentication = mockAuthentication();
  const validation = mockValidation();
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
    const authenticationSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockResolvedValueOnce("");
    const request = mockRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(unauthorized());
  });

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockRejectedValueOnce(new Error());
    const request = mockRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new ServerError("")));
  });

  test("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const request = mockRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(ok({ accessToken: "access_token" }));
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy).toHaveBeenCalledWith(request.body);
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new InvalidParamError("any_field"));
    const request = mockRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new InvalidParamError("any_field")));
  });
});
