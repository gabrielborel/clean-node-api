import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentations/protocols";
import { LogControllerDecorator } from "./log";

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 201,
        body: {},
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return { sut, controllerStub };
};

describe("Log Decorator", () => {
  test("should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "valid_email@mail.com",
        password: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
