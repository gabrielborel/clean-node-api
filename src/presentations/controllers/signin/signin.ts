import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  EmailValidator,
} from "./signin-protocols";

export class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = request.body;
      const isValid = this.emailValidator.validate(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      });
      if (!accessToken) {
        return unauthorized();
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
