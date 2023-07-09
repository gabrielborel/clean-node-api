import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { created, serverError } from "@/presentations/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentations/protocols";
import { LogControllerDecorator } from "./log-controller-decorator";
import { mockAccountModel } from "@/domain/test";
import { mockLogErrorRepository } from "@/data/test";

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const httpResponse = created(mockAccountModel());
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

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return { sut, controllerStub, logErrorRepositoryStub };
};

describe("Log Decorator", () => {
  test("should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(created(mockAccountModel()));
  });

  test("should call LogErrorRepository with correct stackTrace if controllers returns an server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    jest.spyOn(controllerStub, "handle").mockResolvedValueOnce(error);
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
