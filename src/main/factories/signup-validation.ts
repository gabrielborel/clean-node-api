import { EmailValidation } from "../../presentations/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../presentations/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../presentations/helpers/validators/validation-composite";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", emailValidator),
  ]);
};
