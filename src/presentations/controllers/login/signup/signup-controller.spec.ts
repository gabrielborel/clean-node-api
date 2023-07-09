import {
  mockAuthentication,
  mockCreateAccount,
  mockValidation,
} from "@/presentations/test";
import { SignUpController } from "./signup-controller";
import {
  Authentication,
  CreateAccount,
  HttpRequest,
  InvalidParamError,
  ParamAlreadyInUseError,
  ServerError,
  Validation,
  badRequest,
  created,
  forbidden,
  serverError,
} from "./signup-controller-protocols";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
  },
});

type SutType = {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutType => {
  const createAccount = mockCreateAccount();
  const validation = mockValidation();
  const authentication = mockAuthentication();
  const sut = new SignUpController(createAccount, validation, authentication);
  return {
    sut,
    createAccountStub: createAccount,
    validationStub: validation,
    authenticationStub: authentication,
  };
};

describe("SignUp Controller", () => {
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
    jest.spyOn(createAccountStub, "create").mockRejectedValueOnce(new Error());
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(serverError(new ServerError("")));
  });

  test("should return 403 if CreateAccount returns null", async () => {
    const { sut, createAccountStub } = makeSut();
    jest.spyOn(createAccountStub, "create").mockResolvedValue(null);
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(forbidden(new ParamAlreadyInUseError("email")));
  });

  test("should return 201 if valid data is provided", async () => {
    const { sut } = makeSut();
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(
      created({
        accessToken: "access_token",
      })
    );
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
    validationSpy.mockReturnValueOnce(new InvalidParamError("any_field"));
    const request = makeFakeRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new InvalidParamError("any_field")));
  });

  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authenticationSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      return new Promise<string>((resolve, reject) => reject(new Error()));
    });
    const httpRequest = makeFakeRequest();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(serverError(new Error()));
  });
});
