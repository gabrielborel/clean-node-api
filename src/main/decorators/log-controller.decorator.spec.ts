import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { AccountModel } from "@/domain/models/account";
import { created, serverError } from "@/presentations/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentations/protocols";
import { LogControllerDecorator } from "./log-controller-decorator";
import { test, describe, vi, expect } from "vitest";

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const httpResponse = created(makeFakeAccount());
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
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

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepositoryStub();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return { sut, controllerStub, logErrorRepositoryStub };
};

describe("Log Decorator", () => {
  test("should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = vi.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(created(makeFakeAccount()));
  });

  test("should call LogErrorRepository with correct stackTrace if controllers returns an server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    vi.spyOn(controllerStub, "handle").mockReturnValueOnce(
      new Promise((resolve) => resolve(error))
    );
    const logSpy = vi.spyOn(logErrorRepositoryStub, "logError");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
