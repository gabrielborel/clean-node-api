import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest } from "../../protocols";
import { SignInController } from "./signin";

const makeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

interface SutType {
  sut: SignInController;
}

const makeSut = (): SutType => {
  const signinController = new SignInController();
  return {
    sut: signinController,
  };
};

describe("Signin Controller", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeRequest();
    delete httpRequest.body.email;
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });
});
