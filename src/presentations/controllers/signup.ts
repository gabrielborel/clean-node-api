import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password"];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValid = this.emailValidator.validate(request.body.email);
    if (!isValid) {
      return badRequest(new InvalidParamError("email"));
    }

    return {
      statusCode: 201,
      body: {},
    };
  }
}