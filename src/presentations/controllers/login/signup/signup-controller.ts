import { ParamAlreadyInUseError } from "../../../errors";
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../helpers/http/http-helper";
import { Authentication } from "../signin/signin-controller-protocols";
import {
  Controller,
  CreateAccount,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-controller-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly createAccount: CreateAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request.body;

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });
      if (!account) {
        return forbidden(new ParamAlreadyInUseError("email"));
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      return created({
        accessToken: accessToken,
      });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
