import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, created, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  CreateAccount,
} from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "email", "password"];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
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
