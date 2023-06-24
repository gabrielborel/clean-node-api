import { describe, expect, test, vi } from "vitest";
import { HttpRequest } from "../protocols/http";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AuthMiddleware } from "./auth-middleware";
import { FindAccountByAccessToken } from "../../domain/use-cases/find-account-by-access-token";
import { AccountModel } from "../../domain/models/account";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "any_email@mail.com",
  password: "hashed_password",
  accessToken: "valid_token",
});

const makeFindAccountByAccessTokenStub = () => {
  class FindAccountByAccessTokenStub implements FindAccountByAccessToken {
    async find(
      accessToken: string,
      role?: string | undefined
    ): Promise<AccountModel | null> {
      return makeFakeAccount();
    }
  }
  return new FindAccountByAccessTokenStub();
};

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    ["x-access-token"]: "any_token",
  },
});

interface SutType {
  sut: AuthMiddleware;
  findAccountByAccessTokenStub: FindAccountByAccessToken;
}

const makeSut = (role?: string): SutType => {
  const findAccountByAccessToken = makeFindAccountByAccessTokenStub();
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
    const findAccountByAccessTokenSpy = vi.spyOn(
      findAccountByAccessTokenStub,
      "find"
    );
    await sut.handle(httpRequest);
    expect(findAccountByAccessTokenSpy).toHaveBeenCalledWith("any_token", role);
  });

  test("should return 403 if FindAccountByAccessToken returns null", async () => {
    const { sut, findAccountByAccessTokenStub } = makeSut();
    vi.spyOn(findAccountByAccessTokenStub, "find").mockReturnValueOnce(
      new Promise((resolve) => resolve(null))
    );
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
        accountId: "valid_id",
      })
    );
  });

  test("should return 500 if FindAccountByAccessToken throws", async () => {
    const { sut, findAccountByAccessTokenStub } = makeSut();
    vi.spyOn(findAccountByAccessTokenStub, "find").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
