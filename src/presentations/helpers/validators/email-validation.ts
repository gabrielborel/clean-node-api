import { InvalidParamError, MissingParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(data: any): Error | null {
    const isValid = this.emailValidator.validate(data[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
