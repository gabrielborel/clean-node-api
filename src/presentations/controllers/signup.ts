import { CreateAccount } from "../../domain/use-cases/create-account";
import { InvalidParamError, MissingParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount
  ) {}

  handle(request: HttpRequest): HttpResponse {
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

      this.createAccount.create({
        name,
        email,
        password,
      });

      return {
        statusCode: 201,
        body: {},
      };
    } catch (e) {
      return serverError();
    }
  }
}
