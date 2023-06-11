import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { ValidationComposite } from "./validation-composite";

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

describe("Validation Composite", () => {
  test("should return an error if any validation fails", async () => {
    const validationStub = makeValidation();
    const sut = new ValidationComposite([validationStub]);
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new MissingParamError("email"));
  });
});
