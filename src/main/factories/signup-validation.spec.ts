import { RequiredFieldValidation } from "../../presentations/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../presentations/helpers/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";

jest.mock("../../presentations/helpers/validators/validation-composite");

describe("SignUpValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSignUpValidation();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("name"),
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
    ]);
  });
});
