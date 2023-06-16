import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentations/helpers/validators";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", emailValidator),
  ]);
};
