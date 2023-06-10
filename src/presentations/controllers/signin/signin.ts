import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class SignInController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email } = request.body;
      const isValid = this.emailValidator.validate(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
