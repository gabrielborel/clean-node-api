import { EmailValidation } from "../../presentations/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../presentations/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../presentations/helpers/validators/validation-composite";
import { EmailValidator } from "../../presentations/protocols/email-validator";
import { makeSignUpValidation } from "./signup-validation";

jest.mock("../../presentations/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("SignUpValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSignUpValidation();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("name"),
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new EmailValidation("email", makeEmailValidator()),
    ]);
  });
});
