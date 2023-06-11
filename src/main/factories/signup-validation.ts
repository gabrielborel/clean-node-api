import { RequiredFieldValidation } from "../../presentations/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../presentations/helpers/validators/validation-composite";

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
  ]);
};
