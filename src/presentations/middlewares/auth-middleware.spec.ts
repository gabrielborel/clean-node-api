import { describe, expect, test } from "vitest";
import { HttpRequest } from "../protocols/http";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";
import { AuthMiddleware } from "./auth-middleware";

const makeFakeRequest = (): HttpRequest => ({
  headers: {},
});

interface SutType {
  sut: AuthMiddleware;
}

const makeSut = (): SutType => {
  const sut = new AuthMiddleware();
  return { sut };
};

describe("Auth Middleware", () => {
  test("should return 403 no x-access-token exists in header", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
