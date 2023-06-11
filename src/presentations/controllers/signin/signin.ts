import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http/http-helper";
import { Validation } from "../signup/signup-protocols";
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
} from "./signin-protocols";

export class SignInController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request.body;
      const accessToken = await this.authentication.auth({
        email,
        password,
      });
      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
