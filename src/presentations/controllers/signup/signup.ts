import { badRequest, created, serverError } from "../../helpers/http-helper";
import {
  Controller,
  CreateAccount,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly createAccount: CreateAccount,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const account = await this.createAccount.create(request.body);
      return created(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
