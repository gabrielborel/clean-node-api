import { mockFindAccountByAccessToken } from "@/presentations/test";
import { AuthMiddleware } from "./auth-middleware";
import {
  FindAccountByAccessToken,
  HttpRequest,
  forbidden,
  ok,
  serverError,
  AccessDeniedError,
} from "./auth-middleware-protocols";

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    ["x-access-token"]: "any_token",
  },
});

type SutType = {
  sut: AuthMiddleware;
  findAccountByAccessTokenStub: FindAccountByAccessToken;
};

const makeSut = (role?: string): SutType => {
  const findAccountByAccessToken = mockFindAccountByAccessToken();
  const sut = new AuthMiddleware(findAccountByAccessToken, role);
  return { sut, findAccountByAccessTokenStub: findAccountByAccessToken };
};

describe("Auth Middleware", () => {
  test("should return 403 no x-access-token exists in header", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.headers?.["x-access-token"];
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("should call FindAccountByAccessToken with correct accessToken", async () => {
    const role = "any_role";
    const { sut, findAccountByAccessTokenStub } = makeSut(role);
    const httpRequest = makeFakeRequest();
    const findAccountByAccessTokenSpy = jest.spyOn(
      findAccountByAccessTokenStub,
      "find"
    );
    await sut.handle(httpRequest);
    expect(findAccountByAccessTokenSpy).toHaveBeenCalledWith("any_token", role);
  });

  test("should return 403 if FindAccountByAccessToken returns null", async () => {
    const { sut, findAccountByAccessTokenStub } = makeSut();
    jest
      .spyOn(findAccountByAccessTokenStub, "find")
      .mockResolvedValueOnce(null);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("should return 200 if FindAccountByAccessToken returns an account", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      ok({
        accountId: "any_id",
      })
    );
  });

  test("should return 500 if FindAccountByAccessToken throws", async () => {
    const { sut, findAccountByAccessTokenStub } = makeSut();
    jest
      .spyOn(findAccountByAccessTokenStub, "find")
      .mockRejectedValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
