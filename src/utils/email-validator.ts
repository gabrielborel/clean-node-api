import { EmailValidator } from "../presentations/protocols/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
  validate(email: string): boolean {
    return false;
  }
}
