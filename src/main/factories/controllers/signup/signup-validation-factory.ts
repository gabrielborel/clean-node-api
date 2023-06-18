import { EmailValidatorAdapter } from "../../../../utils/email-validator-adapter";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";

export const makeSignUpValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", emailValidator),
  ]);
};
