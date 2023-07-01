import { EmailValidator } from "@/validation/protocols/email-validator";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";
import { makeSignUpValidation } from "./signup-validation-factory";
import { test, describe, vi, expect } from "vitest";

vi.mock("@/validation/validators/validation-composite");

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
