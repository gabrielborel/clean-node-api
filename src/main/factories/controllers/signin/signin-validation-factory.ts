import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../presentations/helpers/validators";
import { EmailValidatorAdapter } from "../../../../utils/email-validator-adapter";

export const makeSignInValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", emailValidator),
  ]);
};
