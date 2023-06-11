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

interface SutType {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutType => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe("Validation Composite", () => {
  test("should return an error if any validation fails", async () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new MissingParamError("email"));
  });

  test("should return the first error if more than one validation fails", async () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new Error());
  });

  test("should return nothing if validation succeeds", async () => {
    const { sut } = makeSut();
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toBeNull();
  });
});
