import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";
import { makeCreateSurveyValidation } from "./create-survey-validation-factory";

jest.mock("@/validation/validators/validation-composite");

describe("CreateSurveyValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeCreateSurveyValidation();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("question"),
      new RequiredFieldValidation("answers"),
    ]);
  });
});
