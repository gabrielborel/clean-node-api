import { InvalidParamError } from "../../errors";
import { badRequest, created, serverError } from "../../helpers/http-helper";
import {
  Controller,
  CreateAccount,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const { email, password, name } = request.body;
      const isValid = this.emailValidator.validate(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });
      return created(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
