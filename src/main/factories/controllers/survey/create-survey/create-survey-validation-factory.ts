import {
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";

export const makeCreateSurveyValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation("question"),
    new RequiredFieldValidation("answers"),
  ]);
};
