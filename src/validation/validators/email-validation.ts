import { InvalidParamError } from "@/presentations/errors";
import { Validation } from "@/presentations/protocols/validation";
import { EmailValidator } from "../protocols/email-validator";

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
